import { useEffect, useRef, useState } from "react";
import { useIncomeContext } from "../components/shared/IncomeContext";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import { Button, Container, Form, Modal, Row, Col, Card } from "react-bootstrap";

const Incomes = () => {
  const { formError, setFormError } = useFormErrorContext();
  const { income, incomeList, fetchIncome, fetchIncomeList, createIncome, updateIncome, deleteIncome } = useIncomeContext();

  const incomeId = useRef("");

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [newIncomeName, setNewIncomeName] = useState("");
  const [newIncomeDescription, setNewIncomeDescription] = useState("");
  const [deleteIncomeId, setDeleteIncomeId] = useState("");

  useEffect(() => {
    setFormError(""); // Clear previous form error on component mount
  }, []);

  useEffect(() => {
    if (!incomeList) {
      fetchIncomeList();
    }
  }, [incomeList, fetchIncomeList]);

  const handleToggleModal = (title, forceClose = false) => {
    setShowModal((prevShowModal) => forceClose ? false : !prevShowModal);
    setModalTitle(title);
  };
  
  const handleAddIncome = async () => {
    setFormError(""); // Clear previous form error

    if (newIncomeName.trim() === "") {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        name: newIncomeName,
        description: newIncomeDescription
      };
      await createIncome(payload);

      setNewIncomeName("");
      setNewIncomeDescription("");
      handleToggleModal("");
      fetchIncomeList(); // Updating the list after successful addition
    }
  };

  const handleEditIncome = (id, name, description) => {
    setFormError(""); // Clear previous form error
    setNewIncomeName(name);
    setNewIncomeDescription(description);
    incomeId.current = id;
    handleToggleModal("Edit Income");
  };

  const handleUpdateIncome = async () => {
    setFormError(""); // Clear previous form error

    if (newIncomeName.trim() === "") {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        id: incomeId.current,
        name: newIncomeName,
        description: newIncomeDescription
      };
      await updateIncome(payload);

      setNewIncomeName("");
      setNewIncomeDescription("");
      incomeId.current = "";
      handleToggleModal("");
      fetchIncomeList(); // Updating the list after successful editing
    }
  };

  const handleDeleteIncome = async () => {
    await deleteIncome(deleteIncomeId);

    setDeleteIncomeId("");
    handleToggleModal("");
    fetchIncomeList(); // Updating the list after successful deletion
  };

  return (
    <>
      <Container className="mt-2">
        <Button className="button_style_add" onClick={() => handleToggleModal("Add Income")}>
          +Add Income
        </Button>
        <Row xs={1} md={2} className="g-4">
          {incomeList.map((item) => (
            <Col key={item.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>Description: {item.description}</Card.Text>
                  <Card.Footer>
                    <Button
                      className="button_style"
                      style={{ backgroundColor: "forestgreen" }}
                      onClick={() => handleEditIncome(item.id, item.name, item.description)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="button_style ms-2"
                      style={{ backgroundColor: "firebrick" }}
                      onClick={() => {
                        setDeleteIncomeId(item.id);
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
      <Modal show={showModal} onHide={() => handleToggleModal("", true)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        {modalTitle === "Add Income" && (
          <Modal.Body>
            {[ // Content wrapped in an array
              <Form key="add-income-form">
                <Form.Group controlId="formIncomeName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newIncomeName}
                    onChange={(e) => setNewIncomeName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formIncomeDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newIncomeDescription}
                    onChange={(e) => setNewIncomeDescription(e.target.value)}
                  />
                </Form.Group>
              </Form>
            ]}
          </Modal.Body>
        )}
        {modalTitle === "Edit Income" && (
          <Modal.Body>
            {[ // Content wrapped in an array
              <Form key="edit-income-form">
                <Form.Group controlId="formIncomeName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newIncomeName}
                    onChange={(e) => setNewIncomeName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formIncomeDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newIncomeDescription}
                    onChange={(e) => setNewIncomeDescription(e.target.value)}
                  />
                </Form.Group>
              </Form>
            ]}
          </Modal.Body>
        )}
        {modalTitle === "Confirm Delete" && (
          <Modal.Body>Are you sure you want to delete this Income?</Modal.Body>
        )}
        <Modal.Footer>
          {formError && <div className="text-danger col-12">{formError}</div>}
          <Button variant="secondary" onClick={() => handleToggleModal("", true)}>
            Cancel
          </Button>
          {modalTitle === "Add Income" && (
            <Button variant="primary" onClick={handleAddIncome}>
              Add
            </Button>
          )}
          {modalTitle === "Edit Income" && (
            <Button variant="primary" onClick={handleUpdateIncome}>
              Update
            </Button>
          )}
          {modalTitle === "Confirm Delete" && (
            <Button variant="danger" onClick={handleDeleteIncome}>
              Delete
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Incomes;