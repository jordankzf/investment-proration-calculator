function InvestorFields({ id }: { id: number }) {
  return (
    <div className="investor-fields-wrapper">
      <div className="input-symbol-user">
        <input
          type="text"
          id={`name-${id}`}
          name={`name-${id}`}
          placeholder="Name"
          min="0"
        />
      </div>
      <div className="input-symbol-dollar">
        <input
          type="number"
          id={`requested-${id}`}
          name={`requested-${id}`}
          placeholder="Requested Amount"
          min="0"
        />
      </div>
      <div className="input-symbol-dollar">
        <input
          type="number"
          id={`average-${id}`}
          name={`average-${id}`}
          placeholder="Average Amount"
          min="0"
        />
      </div>
    </div>
  );
}

export default InvestorFields;
