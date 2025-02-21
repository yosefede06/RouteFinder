import React from 'react';

const SubmitRouteButton = ({onSubmit, disabled, loading }) => (
  <button
    className="btn btn-success mx-2 d-flex align-items-center"
    onClick={onSubmit}
    disabled={disabled}
  >
    {loading ? (
      <>
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Generating...
      </>
    ) : (
      "Generate Route"
    )}
  </button>
);

export default SubmitRouteButton;