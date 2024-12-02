import React, { useEffect, useState } from "react";
import { Card, Row, Col, Modal, ModalHeader, ModalBody, Button } from "reactstrap";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Store selected transaction
  const [modalOpen, setModalOpen] = useState(false); // Manage modal visibility

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction); // Set the clicked transaction
    toggleModal(); // Open the modal
  };

  return (
    <div>
      <Row>
        <Col md="12">
          <Card body className="border-0 mb-4">
            <h5 className="mb-4">Transaction History</h5>
            <div className="all-documentboxes p-3">
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="documentboxes text-center"
                    onClick={() => handleTransactionClick(transaction)} // Handle click
                    style={{
                        cursor: "pointer",
                        border: "1px solid #ddd",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        backgroundColor: "#f8f9fa",
                        overflow: "hidden", // Contain overflowing content
                        textOverflow: "ellipsis", // Add ellipsis for truncated text
                        whiteSpace: "nowrap", // Prevent text from wrapping
                    }}
                  >
                    <p className="mb-2">Transaction ID: {transaction.transactionHash}</p>
                    <p className="mb-2">Amount: ${transaction.tokenAmount}</p>
                    <p className="mb-0">Recipient Address: {transaction.recipientAddress}</p>
                  </div>
                ))
              ) : (
                <p className="text-center">No transactions found</p>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Modal for Transaction Details */}
      {selectedTransaction && (
        <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
          <ModalHeader toggle={toggleModal}>Transaction Details</ModalHeader>
          <ModalBody>
            <p><strong>Transaction ID:</strong> {selectedTransaction.transactionHash}</p>
            <p><strong>Amount:</strong> ${selectedTransaction.tokenAmount}</p>
            <p><strong>Recipient Address:</strong> {selectedTransaction.recipientAddress}</p>
            <Button color="primary" onClick={toggleModal} className="mt-3">
              Close
            </Button>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
