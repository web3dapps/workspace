 import React, { useState } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

function MyAgentSpace(args) {
    const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Button className='p-2 w-100 ' color="secondary" onClick={toggle} style={{ marginBottom: '1rem' }}>
       My Agentspace
      </Button>
      <Collapse isOpen={isOpen} {...args}>
        <Card>
          <CardBody className='bg-dark flex'>
           
                <button type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="schedule-meeting-general">
                  Document generator
                </button>
                 <button type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="ai-form-fillup-task">
                   Resume Builder
                 </button>
                 <button type="button" class="btn btn-warning  me-1 mb-2 btn-sm fs-10" id="set-reminder-general" onclick="showConnectingMessage('reminder')">
                   Lession planner
                 </button>
             
          </CardBody>
        </Card>
      </Collapse>
    </>
  );
}

export default MyAgentSpace




 
 
   