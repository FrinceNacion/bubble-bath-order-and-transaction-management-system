import { useState } from "react";

function OrderDetailsModal({ order, onHide }) {
    return
    <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header pb-0 border-0">
                    <h5 className="modal-title" id="newCustomerModalLabel">Order Details</h5>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>
                <div className="modal-body d-flex flex-column">
                    <div className="d-flex flex-row">
                        <div className="d-flex flex-column">
                            <p className="m-0 text-secondary small">
                                Customer
                            </p>
                            <p className="text-dark">{order.customer}</p>
                        </div>
                        <div className="d-flex flex-column">
                            <p className="m-0 text-secondary small">
                                Order ID
                            </p>
                            <p className="text-dark">{order.order_id}</p>
                        </div>
                    </div>
                    <div className="d-flex flex-row">
                        <div className="d-flex flex-column">
                            <p className="m-0 text-secondary small">
                                Order Date
                            </p>
                            <p className="text-dark">{order.order_date.split(" ")[0]}</p>
                        </div>
                        <div className="d-flex flex-column">
                            <p className="m-0 text-secondary small">
                                Due Date
                            </p>
                            <p className="text-dark">{order.pickup_date.split(" ")[0]}</p>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <p className="m-0 text-secondary small">
                            Status
                        </p>
                        <div className="d-flex flex-row">
                            <div className="d-flex flex-row">
                                <i className="bi bi-clock"></i>
                                Pending
                            </div>
                            <div className="d-flex flex-row">
                                <i className="bi bi-clock"></i>
                                In Progress
                            </div>
                            <div className="d-flex flex-row">
                                <i className="bi bi-clock"></i>
                                Ready
                            </div>
                            <div className="d-flex flex-row">
                                <i className="bi bi-clock"></i>
                                Claimed
                            </div>
                            <div className="d-flex flex-row">
                                <i className="bi bi-clock"></i>
                                Cancelled
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <p className="m-0 text-secondary small">
                            Garments
                        </p>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Type</th>
                                    <th scope="col">Service</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

function OrderDetailsButton({ order, onRefresh }) {
    const [showModal, setShowModal] = useState(false);

    return
    <>
        <button className="btn btn-outline-dark d-flex flex-row gap-2" onClick={() => setShowModal(true)}>
            <i className="bi bi-eye" />
            See Details
        </button>
        {showModal && <EditCustomerModal order={order} onHide={() => setShowModal(false)} onRefresh={onRefresh} />}
    </>
}

export default OrderDetailsButton;