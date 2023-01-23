export default function ChatList() {
  return (
    <div
      className="card h-100 border-0"
      style={{ maxWidth: "48vh", minHeight: "80vh" }}
    >
      <div
        className="card-header text-center"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <h2 className="p-3" style={{ color: "#6c6665" }}>
          Contacts
        </h2>
      </div>
      <div
        className="card-body overflow-auto"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <div className="d-flex flex-column gap-2">
          <div className="p-2">Contact 1</div>
          <div className="p-2">Contact 2</div>
          <div className="p-2">Contact 3</div>
          <div className="p-2">Contact 4</div>
        </div>
      </div>
      <div
        className="card-footer border-top-0"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <div className="form-group row w-100 mx-auto">
          <button className="btn btn-outline-danger border-2 rounded-2 mx-auto w-auto">
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
}
