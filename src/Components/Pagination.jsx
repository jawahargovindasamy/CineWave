import React from "react";

const Pagination = ({ currentPage, totalPages, onPrev, onNext }) => {
  return (
    <div className="d-flex justify-content-center align-items-center gap-3 pb-4">
      <button
        className="btn btn-light"
        disabled={currentPage === 1}
        onClick={onPrev}
      >
        Prev
      </button>

      <span className="text-white">
        {currentPage} / {totalPages}
      </span>

      <button
        className="btn btn-light"
        disabled={currentPage === totalPages}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
