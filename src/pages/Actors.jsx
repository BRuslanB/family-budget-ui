import { useEffect, useRef, useState } from "react";
import { useActorContext } from "../components/shared/ActorContext";
import { useFormErrorContext } from '../components/shared/FormErrorContext';
import { Button, Container, Form, Modal, Row, Col, Card } from "react-bootstrap";

const Actors = () => {
  const { formError, setFormError } = useFormErrorContext();
  const { actor, actorList, fetchActor, fetchActorList, createActor, updateActor, deleteActor } = useActorContext();

  const actorId = useRef("");

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [newActorName, setNewActorName] = useState("");
  const [newActorDescription, setNewActorDescription] = useState("");
  const [deleteActorId, setDeleteActorId] = useState("");

  useEffect(() => {
    setFormError(""); // Clear previous form error on component mount
  }, []);

  useEffect(() => {
    if (!actorList) {
      fetchActorList();
    }
  }, [actorList, fetchActorList]);

  const handleToggleModal = (title, forceClose = false) => {
    setShowModal((prevShowModal) => forceClose ? false : !prevShowModal);
    setModalTitle(title);
  };
  
  const handleAddActor = async () => {
    setFormError(""); // Clear previous form error

    if (newActorName.trim() === "") {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        name: newActorName,
        description: newActorDescription
      };
      await createActor(payload);

      setNewActorName("");
      setNewActorDescription("");
      handleToggleModal("");
      fetchActorList(); // Updating the list after successful addition
    }
  };

  const handleEditActor = (id, name, description) => {
    setFormError(""); // Clear previous form error
    setNewActorName(name);
    setNewActorDescription(description);
    actorId.current = id;
    handleToggleModal("Edit Actor");
  };

  const handleUpdateActor = async () => {
    setFormError(""); // Clear previous form error

    if (newActorName.trim() === "") {
      setFormError("Please fill in all the required fields.");
    } else {
      const payload = {
        id: actorId.current,
        name: newActorName,
        description: newActorDescription
      };
      await updateActor(payload);

      setNewActorName("");
      setNewActorDescription("");
      actorId.current = "";
      handleToggleModal("");
      fetchActorList(); // Updating the list after successful editing
    }
  };

  const handleDeleteActor = async () => {
    await deleteActor(deleteActorId);

    setDeleteActorId("");
    handleToggleModal("");
    fetchActorList(); // Updating the list after successful deletion
  };

  return (
    <>
      <Container className="mt-2">
        <Button className="button_style_add" onClick={() => handleToggleModal("Add Actor")}>
          +Add Actor
        </Button>
        <Row xs={1} md={2} className="g-4">
          {actorList.map((item) => (
            <Col key={item.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>Description: {item.description}</Card.Text>
                  <Card.Footer>
                    <Button
                      className="button_style"
                      style={{ backgroundColor: "forestgreen" }}
                      onClick={() => handleEditActor(item.id, item.name, item.description)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="button_style ms-2"
                      style={{ backgroundColor: "firebrick" }}
                      onClick={() => {
                        setDeleteActorId(item.id);
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
        {modalTitle === "Add Actor" && (
          <Modal.Body>
            {[ // Content wrapped in an array
              <Form key="add-actor-form">
                <Form.Group controlId="formActorName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newActorName}
                    onChange={(e) => setNewActorName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formActorDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newActorDescription}
                    onChange={(e) => setNewActorDescription(e.target.value)}
                  />
                </Form.Group>
              </Form>
            ]}
          </Modal.Body>
        )}
        {modalTitle === "Edit Actor" && (
          <Modal.Body>
            {[ // Content wrapped in an array
              <Form key="edit-actor-form">
                <Form.Group controlId="formActorName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newActorName}
                    onChange={(e) => setNewActorName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formActorDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newActorDescription}
                    onChange={(e) => setNewActorDescription(e.target.value)}
                  />
                </Form.Group>
              </Form>
            ]}
          </Modal.Body>
        )}
        {modalTitle === "Confirm Delete" && (
          <Modal.Body>Are you sure you want to delete this Actor?</Modal.Body>
        )}
        <Modal.Footer>
          {formError && <div className="text-danger col-12">{formError}</div>}
          <Button variant="secondary" onClick={() => handleToggleModal("", true)}>
            Cancel
          </Button>
          {modalTitle === "Add Actor" && (
            <Button variant="primary" onClick={handleAddActor}>
              Add
            </Button>
          )}
          {modalTitle === "Edit Actor" && (
            <Button variant="primary" onClick={handleUpdateActor}>
              Update
            </Button>
          )}
          {modalTitle === "Confirm Delete" && (
            <Button variant="danger" onClick={handleDeleteActor}>
              Delete
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Actors;