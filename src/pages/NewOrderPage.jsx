import CreateOrderForm from "../components/CreateOrderForm";
function NewOrderPage() {

    return (
        <main className="container flex-fill p-4 p-xl-5">
            <div className="d-flex flex-column">
                <h4 className="fw-semibold text-dark mb-1">Create New Order</h4>
                <p className="text-secondary small mb-4">Add garment details and create a new order.</p>
            </div>
            <div className="d-flex flex-column">
                <CreateOrderForm />
            </div>
        </main>
    )
}

export default NewOrderPage;