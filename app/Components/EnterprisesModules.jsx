import React, { useState } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

function EnterprisesModules(args) {
    const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Button className='p-2 w-100 ' color="secondary" onClick={toggle} style={{ marginBottom: '1rem' }}>
        Enterprises Modules
      </Button>
      <Collapse isOpen={isOpen} {...args}>
        <Card>
          <CardBody className='bg-dark flex'>
             <button type="button" class="btn btn-warning me-1 mb-2 btn-sm fs-10" id="legal-contract" data-bs-toggle="modal" data-bs-target="#contentCreatorModal">
              Content Creator
            </button>
            <button class="btn btn-warning  me-1 mb-2 btn-sm fs-10"  id="connect-crm-btn-business" onclick="showConnectingMessage('crm')">
              Connect to CRM
            </button>
            <a href="/dashboard/workspace-supported-platform/" type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="connect-zoho-business">
              Connect to Zoho
            </a>
            <a href="/dashboard/workspace-supported-platform/" type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="connect-salesforce-business">
              Connect to Salesforce
            </a>
            <button type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="connect-lms-learning" onclick="showConnectingMessage('lms')">
              Connect to LMS
            </button>
            <button type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="digital-document" onclick="showConnectingMessage('digital_document')">
              Connect to Digital Document
            </button>
            <button type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="scanned-document" onclick="showConnectingMessage('scanned_document')">
              Scanned Documents
            </button>
            <button type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="legal-contract"  data-bs-toggle="modal" data-bs-target="#LegalContractModal">
              Legal Contract Creation
            </button>
            <button type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="legal-contract"  data-bs-toggle="modal" data-bs-target="#LegalContractModal">
              Legal Contract review
            </button>
          </CardBody>
        </Card>
      </Collapse>
    </>
  );
}

export default EnterprisesModules
