import { useEffect, useRef, useState } from "react";
import { useCheckContext } from "../components/shared/CheckContext";
import { useIncomeContext } from "../components/shared/IncomeContext";
import { useExpenseContext } from "../components/shared/ExpenseContext";
import { useActorContext } from "../components/shared/ActorContext";
import { useReceiptContext } from "../components/shared/ReceiptContext";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import { Button, Container, Form, Modal, Row, Col, Card } from "react-bootstrap";

const Checks = () => {

  const { formError, setFormError } = useFormErrorContext();
  const { check, setCheck, checkList, setCheckList, 
    fetchCheck, fetchCheckList, fetchCheckListDates,
    createCheck, updateCheck, updateCheckObject, deleteCheck } = useCheckContext();
  const { incomeList, fetchIncomeList } = useIncomeContext();
  const { expenseList, fetchExpenseList } = useExpenseContext();
  const { actorList, fetchActorList } = useActorContext();
  const { receipt, setReceipt, receiptId, setReceiptId, fetchReceipt, 
    createReceipt, updateReceipt, deleteReceipt } = useReceiptContext();
  
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [newCheckVal, setNewCheckVal] = useState(null);
  const [newCheckDate, setNewCheckDate] = useState("");
  const [newCheckNote, setNewCheckNote] = useState("");
  const [selectedIncomeId, setSelectedIncomeId] = useState(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [selectedActorId, setSelectedActorId] = useState(null);
  const [deleteCheckId, setDeleteCheckId] = useState(null);
  const [receiptFileType, setReceiptFileType] = useState("");
  const [receiptFileContent, setReceiptFileContent] = useState([]);
  const [deleteReceiptId, setDeleteReceiptId] = useState(null);
  
  const checkId = useRef("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormError(""); // Clear previous form error on component mount
    setCheckList([]); // Clear checkList values
  }, []);

  useEffect(() => {
    if (!dateFrom) {
      setDateFrom(localStorage.getItem('date_from'));
    }
    if (!dateTo) {
      setDateTo(localStorage.getItem('date_to'));
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (checkList.length === 0) {
      if (dateFrom && dateTo) {
        fetchCheckListDates(dateFrom, dateTo)
      } else {
        fetchCheckList();
      }
      fetchIncomeList();
      fetchExpenseList();
      fetchActorList();
    }
  }, [checkList, fetchCheckList, fetchCheckListDates]);

  useEffect(() => {
    if (check) {
      if (check.object) {
        // Delete Receipt if object is not null
        deleteReceipt(check.object);
      }
      // Clearing the value of Сheck
      setCheck(null);
    }
  }, [check]);

  useEffect(() => {
    if ((receiptId && !deleteReceiptId) || 
        (receiptId && receiptFileType && receiptFileContent.length !== 0)) {
      handleFetchReceipt();
    } else {
      setReceipt(null);  
    }

    const updateCheckAndFetchList = async () => {
      if ((receiptId && receiptFileType && receiptFileContent.length !== 0) ||
          (!receiptId && deleteReceiptId))  
      {
        await handleUpdateCheckObject();
        if (dateFrom && dateTo) {
          await fetchCheckListDates(dateFrom, dateTo)
        } else {
          await fetchCheckList();
        }
      }
    };
    updateCheckAndFetchList(); // Calling an async function immediately

  }, [receiptId, deleteReceiptId]);

  useEffect(() => {
    if (!showModal) {
      handleModalHide();
    };
  }, [showModal]);

  const handleToggleModal = (title, forceClose = false) => {
    setShowModal((prevShowModal) => forceClose ? false : !prevShowModal);
    setModalTitle(title);
  };

  const handleModalHide = () => {
    setNewCheckVal(null);
    setNewCheckDate("");
    setNewCheckNote("");
    setSelectedIncomeId(null);
    setSelectedExpenseId(null);
    setSelectedActorId(null);
    setDeleteCheckId("");

    setReceipt(null);
    setReceiptId("");
    setReceiptFileType("");
    setReceiptFileContent([]);
    setDeleteReceiptId("");
  
    setFormError("");
    handleToggleModal("", true);
  };

  const applyParam = () => {
    if (!dateFrom || !dateTo) {
        alert("Both dates must be selected!");
        return;
    }
    // Save param in localStorage
    localStorage.setItem('date_from', dateFrom);
    localStorage.setItem('date_to', dateTo);

    fetchCheckListDates(dateFrom, dateTo); // Updating the list after apply param
  }

  const resetParam = () => {
    setDateFrom("");
    setDateTo("");

    // Clear param from localStorage
    delete localStorage.date_from; 
    delete localStorage.date_to;

    fetchCheckList(); // Updating the list after reset param
  }

  const handleAddCheckExpense = async () => {
    setFormError(""); // Clear previous form error

    if (!newCheckVal || newCheckDate.trim() === "" || !selectedActorId || !selectedExpenseId) {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        val: newCheckVal,
        date: newCheckDate,
        note: newCheckNote,
        object: null,
        income: null,
        expense: { id: selectedExpenseId },
        actor: { id: selectedActorId }
      };
      await createCheck(payload);

      handleToggleModal("");

      // Updating the list after successful addition Check
      if (dateFrom && dateTo) {
        fetchCheckListDates(dateFrom, dateTo)
      } else {
        fetchCheckList(); 
      }
    }
  };

  const handleAddCheckIncome = async () => {
    setFormError(""); // Clear previous form error

    if (!newCheckVal || newCheckDate.trim() === "" || !selectedActorId || !selectedIncomeId) {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        val: newCheckVal,
        date: newCheckDate,
        note: newCheckNote,
        object: null,
        income: { id: selectedIncomeId },
        expense: null,
        actor: { id: selectedActorId }
      };
      await createCheck(payload);

      handleToggleModal("");

      // Updating the list after successful addition Check
      if (dateFrom && dateTo) {
        fetchCheckListDates(dateFrom, dateTo)
      } else {
        fetchCheckList(); 
      }
    }
  };

  const handleEditCheck = (id, val, date, note, income, expense, actor) => {
    setFormError(""); // Clear previous form error

    setNewCheckVal(val);
    setNewCheckDate(date);
    setNewCheckNote(note);
    setSelectedIncomeId(income ? income.id : "");
    setSelectedExpenseId(expense ? expense.id : "");
    setSelectedActorId(actor ? actor.id : "");
    checkId.current = id;
    handleToggleModal("Edit Check");
  };

  const handleUpdateCheck = async () => {
    setFormError(""); // Clear previous form error
  
    if (!newCheckVal || newCheckDate.trim() === "" || !selectedActorId || 
      (!selectedIncomeId && !selectedExpenseId)) {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        id: checkId.current,
        val: newCheckVal,
        date: newCheckDate,
        note: newCheckNote,
        income: selectedIncomeId ? { id: selectedIncomeId } : null,
        expense: selectedExpenseId ? { id: selectedExpenseId } : null,
        actor: { id: selectedActorId }
      };
      await updateCheck(payload);

      checkId.current = "";
      handleToggleModal("");

      // Updating the list after successful editing Check
      if (dateFrom && dateTo) {
        fetchCheckListDates(dateFrom, dateTo)
      } else {
        fetchCheckList(); 
      }
    }
  };

  const handleDeleteCheck = async () => {
    setFormError(""); // Clear previous form error
  
    await fetchCheck(deleteCheckId); // Getting the result of fetchCheck
    await deleteCheck(deleteCheckId); // Delete Check
    
    handleToggleModal("");

    // Updating the list after successful deletion Check
    if (dateFrom && dateTo) {
      fetchCheckListDates(dateFrom, dateTo)
    } else {
      fetchCheckList(); 
    }
  };

  const handleFetchReceipt = async () => {
    setFormError(""); // Clear previous form error

    await fetchReceipt(receiptId);
  };

  const handleAddReceipt = async () => {
    setFormError(""); // Clear previous form error

    if (!receiptFileType || receiptFileContent.length === 0) {
      setFormError("Select a receipt file.");
    } else {
      const payload = {
        fileType: receiptFileType,
        fileContent: new String(receiptFileContent) // Convert to string
      };
      await createReceipt(payload); // Get new receiptId

    }
  };

  const handleEditReceipt = (id, object) => {
    setFormError(""); // Clear previous form error

    checkId.current = id;
    setReceiptId(object); // Save the current value in receiptId

    handleToggleModal("Edit Receipt");
  };

  const handleUpdateReceipt = async () => {
    setFormError(""); // Clear previous form error

    if (!receiptFileType || receiptFileContent.length === 0) {
      setFormError("Select a receipt file.");
    } else {
      const payload = {
        id: receiptId,
        fileType: receiptFileType,
        fileContent: new String(receiptFileContent) // Convert to string
      };
      await updateReceipt(payload);

    }
  };

  const handleUpdateCheckObject = async () => {
      const payload = {
      id: checkId.current,
      object: receiptId  ? receiptId : null,
    };
    await updateCheckObject(payload);

    fileInputRef.current.value = null; // Reset file field element value
    setReceiptFileType(""); // Reset file type value
    setReceiptFileContent([]); // Reset file content value
};

  const handleDeleteReceipt = async () => {
    await deleteReceipt(receiptId);

    setReceiptId(""); // Clear the current value in receiptId
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptFileContent(Array.from(new Uint8Array(e.target.result)));
      };
      reader.readAsArrayBuffer(file);
      setReceiptFileType(file.type);
    }
  };
  
  return (
    <>
      <Container className="mt-2">
        {/* Block parameters */}
        <Row className="g-4">
          <Col xs={6} md={2}>
            <Form.Label className="fw-bold">DATE FROM</Form.Label>
          </Col>
          <Col xs={6} md={2}>
            <Form.Label className="fw-bold">DATE TO</Form.Label>
          </Col>
        </Row>
        <Row className="g-4">
          <Col xs={6} md={2}>
            <Form.Control
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </Col>
          <Col xs={6} md={2}>
            <Form.Control
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </Col>
          <Col xs={6} md={4}>
            <Button className="button_style me-2" onClick={applyParam}>
              APPLY
            </Button>
            <Button variant="primary" onClick={resetParam}>
              RESET
            </Button>
          </Col>
        </Row>

        {/* Buttons Add Check */}
        <Row className="g-4 mt-2">
          <Col xs={6} md={12}>
            <Button className="button_style_add_red" 
              onClick={() => handleToggleModal("Add Check Expense")}>
              +Add Check Expense
            </Button>
            <Button className="button_style_add" 
              onClick={() => handleToggleModal("Add Check Income")}>
              +Add Check Income
            </Button>
          </Col>
        </Row>

        {/* Cards Checks */}
        <Row xs={2} sm={3} md={4} className="g-4">
          {checkList.map((item) => (
            <Col key={item.id}>
              <Card>
                <Card.Body>
                  <Card.Title>Suma: {item.expense ? "-" : ""}{item.val} &nbsp; 
                    Date: {item.date}</Card.Title>
                  {item.expense && <Card.Text>Expense: {item.expense.name}</Card.Text>}
                  {item.income && <Card.Text>Income: {item.income.name}</Card.Text>}
                  <Card.Text>Actor: {item.actor ? item.actor.name : "N/A"}</Card.Text>
                  <Card.Text>Note: {item.note}</Card.Text>
                  <Card.Footer>
                    <Button
                      className="button_style"
                      style={{ backgroundColor: "forestgreen" }}
                      onClick={() => handleEditCheck(item.id, item.val, item.date, item.note, 
                        item.income, item.expense, item.actor)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="button_style ms-2"
                      style={{ backgroundColor: "firebrick" }}
                      onClick={() => {
                        setDeleteCheckId(item.id);
                        handleToggleModal("Delete Check");
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      className="button_style ms-2" // align-right
                      style={{ backgroundColor: "MediumBlue" }}
                      onClick={() => handleEditReceipt(item.id, item.object)}
                    >
                      Receipt
                    </Button>
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleModalHide}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        {modalTitle === "Add Check Expense" && (
          <Modal.Body>
            {[ // Content wrapped in an array
              <Form key="add-check-expense-form">
                <Form.Group controlId="formCheckVal">
                  <Form.Label>Value</Form.Label>
                  <Form.Control
                    type="number"
                    value={newCheckVal}
                    onChange={(e) => setNewCheckVal(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formCheckDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newCheckDate}
                    onChange={(e) => setNewCheckDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formCheckExpense">
                  <Form.Label>Expense</Form.Label>
                  <Form.Select
                    value={selectedExpenseId}
                    onChange={(e) => setSelectedExpenseId(e.target.value)}
                  >
                    <option value="">-- Select a Expense --</option>
                    {expenseList.map((expense) => (
                      <option key={expense.id} value={expense.id}>
                        {expense.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="formCheckActor">
                  <Form.Label>Actor</Form.Label>
                  <Form.Select
                    value={selectedActorId}
                    onChange={(e) => setSelectedActorId(e.target.value)}
                  >
                    <option value="">-- Select a Actor --</option>
                    {actorList.map((actor) => (
                      <option key={actor.id} value={actor.id}>
                        {actor.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="formCheckNote">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newCheckNote || ''}
                    onChange={(e) => setNewCheckNote(e.target.value)}
                  />
                </Form.Group>
              </Form>
            ]}
          </Modal.Body>
        )}
        {modalTitle === "Add Check Income" && (
          <Modal.Body>
            {[ // Content wrapped in an array
              <Form key="add-check-income-form">
                <Form.Group controlId="formCheckVal">
                  <Form.Label>Value</Form.Label>
                  <Form.Control
                    type="number"
                    value={newCheckVal}
                    onChange={(e) => setNewCheckVal(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formCheckDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newCheckDate}
                    onChange={(e) => setNewCheckDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formCheckIncome">
                  <Form.Label>Income</Form.Label>
                  <Form.Select
                    value={selectedIncomeId}
                    onChange={(e) => setSelectedIncomeId(e.target.value)}
                  >
                    <option value="">-- Select a Income --</option>
                    {incomeList.map((income) => (
                      <option key={income.id} value={income.id}>
                        {income.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="formCheckActor">
                  <Form.Label>Actor</Form.Label>
                  <Form.Select
                    value={selectedActorId}
                    onChange={(e) => setSelectedActorId(e.target.value)}
                  >
                    <option value="">-- Select a Actor --</option>
                    {actorList.map((actor) => (
                      <option key={actor.id} value={actor.id}>
                        {actor.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="formCheckNote">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newCheckNote || ''}
                    onChange={(e) => setNewCheckNote(e.target.value)}
                  />
                </Form.Group>
              </Form>
            ]}
          </Modal.Body>
        )}
        {modalTitle === "Edit Check" && (
          <Modal.Body>
            {[ // Content wrapped in an array
              <Form key="edit-check-form">
                <Form.Group controlId="formCheckVal">
                  <Form.Label>Value</Form.Label>
                  <Form.Control
                    type="number"
                    value={newCheckVal}
                    onChange={(e) => setNewCheckVal(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formCheckDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newCheckDate}
                    onChange={(e) => setNewCheckDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formCheckExpense">
                  <Form.Label>Expense</Form.Label>
                  <Form.Select
                    value={selectedExpenseId}
                    onChange={(e) => {
                      const expenseId = e.target.value;
                      setSelectedExpenseId(expenseId);
                      // If expenseId is selected, clearing selectedIncomeId
                      if (expenseId !== "") {
                        setSelectedIncomeId("");
                      }
                    }}
                  >
                    <option value="">-- Select an Expense --</option>
                    {expenseList.map((expense) => {
                      if (expense.id !== selectedExpenseId) {
                        return (
                          <option key={expense.id} value={expense.id}>
                            {expense.name}
                          </option>
                        );
                      } else {
                        return (
                          <option key={expense.id} value={expense.id} defaultChecked>
                            {expense.name}
                          </option>
                        );
                      }
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="formCheckIncome">
                  <Form.Label>Income</Form.Label>
                  <Form.Select
                    value={selectedIncomeId}
                    onChange={(e) => {
                      const incomeId = e.target.value;
                      setSelectedIncomeId(incomeId);
                      // If incomeId is selected, clearing selectedExpenseId
                      if (incomeId !== "") {
                        setSelectedExpenseId("");
                      }
                    }}
                  >
                    <option value="">-- Select an Income --</option>
                    {incomeList.map((income) => {
                      if (income.id !== selectedIncomeId) {
                        return (
                          <option key={income.id} value={income.id}>
                            {income.name}
                          </option>
                        );
                      } else {
                        return (
                          <option key={income.id} value={income.id} defaultChecked>
                            {income.name}
                          </option>
                        );
                      }
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="formCheckActor">
                  <Form.Label>Actor</Form.Label>
                  <Form.Select
                    value={selectedActorId}
                    onChange={(e) => setSelectedActorId(e.target.value)}
                  >
                    {actorList.map((actor) => {
                      if (actor.id !== selectedActorId) {
                        return (
                          <option key={actor.id} value={actor.id}>
                            {actor.name}
                          </option>
                        )
                      } else {
                        return (
                          <option key={actor.id} value={actor.id} defaultChecked>
                            {actor.name}
                          </option>
                        )
                      }
                    })}
                  </Form.Select>
                </Form.Group>                
                <Form.Group controlId="formCheckNote">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newCheckNote || ''}
                    onChange={(e) => setNewCheckNote(e.target.value)}
                  />
                </Form.Group>
              </Form>
            ]}
          </Modal.Body>
        )}
        {modalTitle === "Delete Check" && (
          <Modal.Body>Are you sure you want to delete this Check?</Modal.Body>
        )}
        {modalTitle === "Edit Receipt" && (
          <Modal.Body>
            <Form key="edit-receipt-form">
              <Form.Group controlId="formCheckObject">
                {receipt && (
                  <div style={{ width: '100%' }}>
                    <p className="bold-text">Preview:</p>
                    {receipt.fileType.startsWith("image/") ? (
                      <img className="preview-image" alt="Receipt Preview"
                        src={`data:${receipt.fileType};base64,
                          ${btoa(receipt.fileContent.split(',').map(Number).reduce((acc, value) => {
                            return acc + String.fromCharCode(value);
                          }, ''))}`
                        }
                      />
                    ) : (
                      <p className="text-danger">No preview available</p>
                    )}
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId="formCheckObject">
                <Form.Label className="bold-text">File Receipt:</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} ref={fileInputRef} />
              </Form.Group>
            </Form>
          </Modal.Body>
        )}
        <Modal.Footer>
          {formError && <div className="text-danger text-end col-12">{formError}</div>}
          <Button variant="secondary" onClick={handleModalHide}>
            Cancel
          </Button>
          {modalTitle === "Add Check Expense" && (
            <Button variant="primary" onClick={handleAddCheckExpense}>
              Add
            </Button>
          )}
          {modalTitle === "Add Check Income" && (
            <Button variant="primary" onClick={handleAddCheckIncome}>
              Add
            </Button>
          )}
          {modalTitle === "Edit Check" && (
            <Button variant="primary" onClick={handleUpdateCheck}>
              Update
            </Button>
          )}
          {modalTitle === "Delete Check" && (
            <Button variant="danger" onClick={handleDeleteCheck}>
              Delete
            </Button>
          )}
          {modalTitle === "Edit Receipt" && (
            <div>
              <Button variant="danger" disabled={!receiptId}
                  onClick={() => {
                    setDeleteReceiptId(receiptId);
                    handleDeleteReceipt();
                  }}>
                Delete
              </Button>
              <Button className="ms-2" variant="primary"
                onClick={!receiptId ? handleAddReceipt : handleUpdateReceipt}>
                Upload
              </Button>
            </div>
        )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Checks;