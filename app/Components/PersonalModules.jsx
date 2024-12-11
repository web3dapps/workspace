import React, { useState } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

function PersonalModules(args) {
    const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Button className='p-2 w-100 ' color="secondary" onClick={toggle} style={{ marginBottom: '1rem' }}>
        Personal Modules
      </Button>
      <Collapse isOpen={isOpen} {...args}>
        <Card>
          <CardBody className='bg-dark flex'>
           <div class="card-body px-2">
             <button type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="ai-form-fillup-task" onclick="showConnectingMessage('ffu')">
               AI-Form Fill-Up
             </button>
             <button type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="set-reminder-general" onclick="showConnectingMessage('reminder')">
               Set Reminder
             </button>
             <button type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="schedule-meeting-general" onclick="showConnectingMessage('meeting')">
               Schedule Meeting
             </button>
           </div>
          </CardBody>
        </Card>
      </Collapse>
    </>
  );
}

export default PersonalModules



