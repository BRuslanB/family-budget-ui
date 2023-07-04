import { useEffect, useState } from "react";
import { useBudgetContext } from "../components/shared/BudgetContext";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import { Button, Container, Form, Modal, Row, Col, Table } from "react-bootstrap";

const Budgets = () => {

  const { formError, setFormError } = useFormErrorContext();
  const { budgetList, setBudgetList, fetchBudgetList, fetchBudgetListDates,
    checkListByDate, setCheckListByDate, fetchCheckListDate } = useBudgetContext();
  
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  
  useEffect(() => {
    setFormError(""); // Clear previous form error on component mount
    setBudgetList([]); // Clear previous values
  }, []);

  useEffect(() => {
    if (!dateFrom) {
      setDateFrom(localStorage.getItem('date_from'));
    }
    if (!dateTo) {
      setDateTo(localStorage.getItem('date_to'));
    }

    if (budgetList.length === 0) {
      if (dateFrom && dateTo) {
        fetchBudgetListDates(dateFrom, dateTo)
      } else {
        fetchBudgetList();
      }
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (modalTitle) {
      setSelectedRow(checkListByDate);
    }
  }, [modalTitle, checkListByDate]);

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

    fetchBudgetListDates(dateFrom, dateTo); // Updating the list after apply param
  }

  const resetParam = () => {
    setDateFrom("");
    setDateTo("");

    // Clear param from localStorage
    delete localStorage.date_from; 
    delete localStorage.date_to;

    fetchBudgetList(); // Updating the list after reset param
  }

  const openDetailsModal = async (checkDate) => {
    await handleDetailsCheck(checkDate);
    setFormError(""); // Clear previous form error on component mount
    handleToggleModal("Details Check Date");
  };
  
  const handleDetailsCheck = async (checkDate) => {
    await fetchCheckListDate(checkDate);
    setSelectedRow(checkListByDate);
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

        {/* Table Budget */}
        <p className="mt-2 bold-text text-danger">Budget</p>
        <Table striped bordered >
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Sum</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {budgetList.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.date}</td>
                <td>{row.sum}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => openDetailsModal(row.date)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="2" className="bold-text">
                Total amount:
              </td>
              <td colSpan="2" className="bold-text">
                {budgetList.reduce((total, row) => total + row.sum, 0)}
              </td>
            </tr>
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
                    <th>Income</th>
                    <th>Expense</th>
                    <th>Actor</th>
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
                      <td>{row.income ? row.income.name : ""}</td>
                      <td>{row.expense ? row.expense.name : ""}</td>
                      <td>{row.actor.name}</td>
                      <td>{row.note || ""}</td>
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

export default Budgets;