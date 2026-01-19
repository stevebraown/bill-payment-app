const InlineAlert = ({ type = 'info', text }) => {
  return (
    <div className={`alert ${type}`}>
      <span>{text}</span>
    </div>
  );
};

export default InlineAlert;
