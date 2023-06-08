import { useEffect, useRef, useState } from "react";
import { useCheckContext } from "../components/shared/CheckContext";
import { useIncomeContext } from "../components/shared/IncomeContext";
import { useExpenseContext } from "../components/shared/ExpenseContext";
import { useActorContext } from "../components/shared/ActorContext";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import { Button, Container, Form, Modal, Row, Col, Card } from "react-bootstrap";

const Checks = () => {

  const { formError, setFormError } = useFormErrorContext();
  const { check, checkList, fetchCheck, fetchCheckList, 
    createCheck, updateCheck, deleteCheck } = useCheckContext();
  const { incomeList, fetchIncomeList } = useIncomeContext();
  const { expenseList, fetchExpenseList } = useExpenseContext();
  const { actorList, fetchActorList } = useActorContext();
  
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [newCheckVal, setNewCheckVal] = useState("");
  const [newCheckDate, setNewCheckDate] = useState("");
  const [newCheckNote, setNewCheckNote] = useState("");
  const [selectedIncomeId, setSelectedIncomeId] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [selectedActorId, setSelectedActorId] = useState("");
  const [deleteCheckId, setDeleteCheckId] = useState("");

  const checkId = useRef("");

  useEffect(() => {
    setFormError(""); // Clear previous form error on component mount
  }, []);

  useEffect(() => {
    fetchIncomeList();
    fetchExpenseList();
    fetchActorList();
  }, []);

  useEffect(() => {
    if (!checkList) {
      fetchCheckList();
    }
  }, [checkList, fetchCheckList]);
  
  const handleToggleModal = (title, forceClose = false) => {
    setShowModal((prevShowModal) => forceClose ? false : !prevShowModal);
    setModalTitle(title);
  };

  const handleModalHide = () => {
    setNewCheckVal("");
    setNewCheckDate("");
    setNewCheckNote("");
    setSelectedIncomeId("");
    setSelectedExpenseId("");
    setSelectedActorId("");
    handleToggleModal("", true);
  };

  const handleAddCheck = async () => {
    setFormError(""); // Clear previous form error

    if (newCheckVal === "" || newCheckDate.trim() === "" || selectedActorId === "" || 
      (selectedIncomeId === "" & selectedExpenseId === "")) {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        val: newCheckVal,
        date: newCheckDate,
        note: newCheckNote,
        income: selectedIncomeId ? { id: selectedIncomeId } : null,
        expense: selectedExpenseId ? { id: selectedExpenseId } : null,
        actor: selectedActorId ? { id: selectedActorId } : null
      };
      await createCheck(payload);

      handleToggleModal("");
      fetchCheckList(); // Updating the list after successful addition
    }
  };

  const handleEditCheck = (id, val, date, note, income, expense, actor, object) => {
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
        income: selectedIncomeId ? { id: selectedIncomeId } : null,
    console.log("selectedIncomeId=", selectedIncomeId);
    console.log("selectedExpenseId=", selectedExpenseId);
    console.log("selectedActorId=", selectedActorId);
    if (newCheckVal === "" || newCheckDate.trim() === "" || selectedActorId === "" || 
      (selectedIncomeId === "" & selectedExpenseId === "")) {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        id: checkId.current,
        val: newCheckVal,
        date: newCheckDate,
        note: newCheckNote,
        income: selectedIncomeId ? { id: selectedIncomeId } : null,
        expense: selectedExpenseId ? { id: selectedExpenseId } : null,
        actor: selectedActorId ? { id: selectedActorId } : null
      };
      await updateCheck(payload);

      checkId.current = "";
      handleToggleModal("");
      fetchCheckList(); // Updating the list after successful editing
    }
  };

  const handleDeleteCheck = async () => {
    await deleteCheck(deleteCheckId);

    setDeleteCheckId("");
    handleToggleModal("");
    fetchCheckList(); // Updating the list after successful deletion
  };

  return (
    <>
      <Container className="mt-2">
        <Button className="button_style_add" onClick={() => handleToggleModal("Add Check")}>
          +Add Check
        </Button>
        <Row xs={1} md={2} className="g-4">
          {checkList.map((item) => (
            <Col key={item.id}>
              <Card>
                <Card.Body>
                  <Card.Title>Suma:{item.val}  Date:{item.date}</Card.Title>
                  <Card.Text>Income: {item.income ? item.income.name : "N/A"}</Card.Text>
                  <Card.Text>Expense: {item.expense ? item.expense.name : "N/A"}</Card.Text>
                  <Card.Text>Actor: {item.actor ? item.actor.name : "N/A"}</Card.Text>
                  <Card.Text>Note: {item.note}</Card.Text>
                  <Card.Footer>
                    <Button
                      className="button_style"
                      style={{ backgroundColor: "forestgreen" }}
                      onClick={() => handleEditCheck(item.id, item.val, item.date, item.note, 
                        item.income, item.expense, item.actor, item.object)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="button_style ms-2"
                      style={{ backgroundColor: "firebrick" }}
                      onClick={() => {
                        setDeleteCheckId(item.id);
                        handleToggleModal("Confirm Delete");
                      }}
                    >
                      Delete
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
        {modalTitle === "Add Check" && (
          <Modal.Body>
            {[ // Content wrapped in an array
              <Form key="add-check-form">
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
                    value={newCheckNote}
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
                <Form.Group controlId="formCheckIncome">
                  <Form.Label>Income</Form.Label>
                  <Form.Select
                    value={selectedIncomeId}
                    onChange={(e) => setSelectedIncomeId(e.target.value)}
                  >
                    <option value="">-- Select a Income --</option>
                    {incomeList.map((income) => {
                      if (income.id !== selectedIncomeId) {
                        return (
                          <option key={income.id} value={income.id}>
                            {income.name}
                          </option>
                        )
                      } else {
                        return (
                          <option key={income.id} value={income.id} defaultChecked>
                            {income.name}
                          </option>
                        )
                      }
                    })}
                  </Form.Select>
                </Form.Group>                
                <Form.Group controlId="formCheckExpense">
                  <Form.Label>Expense</Form.Label>
                  <Form.Select
                    value={selectedExpenseId}
                    onChange={(e) => setSelectedExpenseId(e.target.value)}
                  >
                    <option value="">-- Select a Expense --</option>
                    {expenseList.map((expense) => {
                      if (expense.id !== selectedExpenseId) {
                        return (
                          <option key={expense.id} value={expense.id}>
                            {expense.name}
                          </option>
                        )
                      } else {
                        return (
                          <option key={expense.id} value={expense.id} defaultChecked>
                            {expense.name}
                          </option>
                        )
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
                    value={newCheckNote}
                    onChange={(e) => setNewCheckNote(e.target.value)}
                  />
                </Form.Group>
              </Form>
            ]}
          </Modal.Body>
        )}
        {modalTitle === "Confirm Delete" && (
          <Modal.Body>Are you sure you want to delete this Check?</Modal.Body>
        )}
        <Modal.Footer>
          {formError && <div className="text-danger col-12 me-auto">{formError}</div>}
          <Button variant="secondary" onClick={handleModalHide}>
            Cancel
          </Button>
          {modalTitle === "Add Check" && (
            <Button variant="primary" onClick={handleAddCheck}>
              Add
            </Button>
          )}
          {modalTitle === "Edit Check" && (
            <Button variant="primary" onClick={handleUpdateCheck}>
              Update
            </Button>
          )}
          {modalTitle === "Confirm Delete" && (
            <Button variant="danger" onClick={handleDeleteCheck}>
              Delete
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Checks;