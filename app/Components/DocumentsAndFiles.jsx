 import React, { useState } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

function DocumentsAndFiles(args) {
    const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Button className='p-2 w-100 ' color="secondary" onClick={toggle} style={{ marginBottom: '1rem' }}>
        Documents & Files
      </Button>
      <Collapse isOpen={isOpen} {...args}>
        <Card>
          <CardBody className='bg-dark flex'>
            <div class="card-body">
                  <div class="col-lg-12 mb-4 mb-lg-0">
                    <div class="document bg-danger">
                        <div class="document-body">
                          <i class="fas fa-file-pdf text-danger"></i>
                        </div>
                        <div class="document-footer">
                            <span class="document-name"> PDF file 2017 </span>
                            <span class="document-description"> 5.3 MB </span>
                        </div>
                    </div>
                  </div>
                  <div class="col-lg-12 mb-4 mb-lg-0">
                    <div class="document bg-success">
                        <div class="document-body">
                            <i class="fas fa-file-excel text-success"></i>
                        </div>
                        <div class="document-footer">
                            <span class="document-name"> Excel file 2017 </span>
                            <span class="document-description"> 2.7 MB </span>
                        </div>
                    </div>
                  </div>
                  <div class="col-lg-12 mb-4 mb-lg-0">
                    <div class="document bg-primary">
                        <div class="document-body">
                            <i class="fas fa-file-word text-primary"></i>
                        </div>
                        <div class="document-footer">
                            <span class="document-name"> Word file 2017 </span>
                            <span class="document-description"> 1.2 MB </span>
                        </div>
                    </div>
                  </div>                
          </div>
          </CardBody>
        </Card>
      </Collapse>
    </>
  );
}

export default DocumentsAndFiles

