import { useEffect, useState } from "react";
import { useReportContext } from "../components/shared/ReportContext";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import { Button, Container, Form, Modal, Row, Col, Table } from "react-bootstrap";

const Reports = () => {

  const { formError, setFormError } = useFormErrorContext();
  const { checkListByIncome, setCheckListByIncome, checkIncomeList, setCheckIncomeList, 
    fetchCheckIncome, fetchCheckIncomeDates, fetchCheckIncomeList, fetchCheckIncomeListDates,
    checkListByExpense, setCheckListByExpense, checkExpenseList, setCheckExpenseList, 
    fetchCheckExpense, fetchCheckExpenseDates, fetchCheckExpenseList, fetchCheckExpenseListDates,
    checkListByActor, setCheckListByActor, checkActorList, setCheckActorList, 
    fetchCheckActor, fetchCheckActorDates, fetchCheckActorList, fetchCheckActorListDates
  } = useReportContext();
  
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    setFormError(""); // Clear previous form error on component mount
    setCheckIncomeList([]); // Clear previous values
    setCheckExpenseList([]); // Clear previous values
    setCheckActorList([]); // Clear previous values
}, []);

  useEffect(() => {
    if (!dateFrom) {
      setDateFrom(localStorage.getItem('date_from'));
    }
    if (!dateTo) {
      setDateTo(localStorage.getItem('date_to'));
    }

    if (checkIncomeList.length === 0 || checkExpenseList.length === 0 || 
      checkActorList.length === 0) {
      if (dateFrom && dateTo) {
        fetchCheckIncomeListDates(dateFrom, dateTo)
        fetchCheckExpenseListDates(dateFrom, dateTo)
        fetchCheckActorListDates(dateFrom, dateTo)
      } else {
        fetchCheckIncomeList();
        fetchCheckExpenseList();
        fetchCheckActorList();
      }
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (modalTitle === "Details Check Income") {
      setSelectedRow(checkListByIncome);

    } else if (modalTitle === "Details Check Expense") {
      setSelectedRow(checkListByExpense);

    } else if (modalTitle === "Details Check Actor") {
      setSelectedRow(checkListByActor);
    }
  }, [modalTitle, checkListByIncome, checkListByExpense, checkListByActor]);

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
    setFormError("");
    setSelectedRow(null);
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

    fetchCheckIncomeListDates(dateFrom, dateTo); // Updating the list after apply param
    fetchCheckExpenseListDates(dateFrom, dateTo); // Updating the list after apply param
    fetchCheckActorListDates(dateFrom, dateTo); // Updating the list after apply param
  }

  const resetParam = () => {
    setDateFrom("");
    setDateTo("");

    // Clear param from localStorage
    delete localStorage.date_from; 
    delete localStorage.date_to;

    fetchCheckIncomeList(); // Updating the list after reset param
    fetchCheckExpenseList(); // Updating the list after reset param
    fetchCheckActorList(); // Updating the list after reset param
  }

  const openDetailsModal = async (name, id) => {
    await handleDetailsCheck(name, id);
    setFormError(""); // Clear previous form error on component mount
    handleToggleModal(name);
  };

  const handleDetailsCheck = async (name, id) => {
    if (name === "Details Check Income") {
      if (dateFrom && dateTo) {
        await fetchCheckIncomeDates(id, dateFrom, dateTo);
      } else {
        await fetchCheckIncome(id);
      }
      setSelectedRow(checkListByIncome);

    } else if (name === "Details Check Expense") {
      if (dateFrom && dateTo) {
        await fetchCheckExpenseDates(id, dateFrom, dateTo);
      } else {
        await fetchCheckExpense(id);
      }
      setSelectedRow(checkListByExpense);

    } else if (name === "Details Check Actor") {
      if (dateFrom && dateTo) {
        await fetchCheckActorDates(id, dateFrom, dateTo);
      } else {
        await fetchCheckActor(id);
      }
      setSelectedRow(checkListByActor);
    }
  }

  return (
    <>
      <Container className="mt-2">
        {/* Block parameters */}
        <Row className="g-4">
          <Col xs={6} sm={4} md={2}>
            <Form.Label className="fw-bold">DATE FROM</Form.Label>
          </Col>
          <Col xs={6} sm={4} md={2}>
            <Form.Label className="fw-bold">DATE TO</Form.Label>
          </Col>
        </Row>
        <Row className="g-4">
          <Col xs={6} sm={4} md={2}>
            <Form.Control
              type="date"
              value={dateFrom || ""}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </Col>
          <Col xs={6} sm={4} md={2}>
            <Form.Control
              type="date"
              value={dateTo || ""}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Button className="button_style me-2" onClick={applyParam}>
              APPLY
            </Button>
            <Button variant="primary" onClick={resetParam}>
              RESET
            </Button>
          </Col>
        </Row>

        {/* Table Check Income */}
        <p className="mt-2 bold-text text-danger">INCOME</p>
        <Table striped bordered >
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Sum</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {checkIncomeList.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.name}</td>
                <td>{row.description || ''}</td>
                <td>{row.sumVal}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => openDetailsModal("Details Check Income", row.id)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Table Check Expense */}
        <p className="mt-2 bold-text text-danger">EXPENSES</p>
        <Table striped bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Sum</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {checkExpenseList.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.name}</td>
                <td>{row.description || ''}</td>
                <td>{row.category.name}</td>
                <td>{row.sumVal}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => openDetailsModal("Details Check Expense", row.id)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Table Check Actor */}
        <p className="mt-2 bold-text text-danger">ACTOR</p>
        <Table striped bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Sum</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {checkActorList.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.name}</td>
                <td>{row.description || ''}</td>
                <td>{row.sumVal}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => openDetailsModal("Details Check Actor", row.id)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={handleModalHide}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        {selectedRow && (
          <Modal.Body>
            {[ // Content wrapped in an array
              <Table striped bordered >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Value</th>
                    <th>Date</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRow.map((row, index) => (
                    <tr key={row.id}>
                      <td>{index + 1}</td>
                      <td className={row.val ? "" : "text-danger"}>
                        {row.val ? row.val : "Invalid Check"}
                      </td>
                      <td>{row.date}</td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ]}
          </Modal.Body>
        )}
        <Modal.Footer>
          {formError && <div className="text-danger text-end col-12">{formError}</div>}
          <Button variant="secondary" onClick={handleModalHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Reports;