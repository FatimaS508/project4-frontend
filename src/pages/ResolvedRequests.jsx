import { useEffect, useState } from "react"
import { getAllRequests } from "../services/requests"

function ResolvedRequests() {
    const [requests, setRequests] = useState([])
    async function loadRequests() {
        try {
            const response = await getAllRequests()
            setRequests(response.requests ?? response)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        loadRequests()
    }, [])

    const resolvedRequests = requests.filter(
        (request) => request.status === "Resolved")

    return (
        <div>
            <h1>Resolved Requests</h1>

            {resolvedRequests.map((request) => {
                const subcategory = request.category?.subcategories?.find(
                    (subcategory) =>
                        subcategory._id.toString() === request.subcategoryId.toString()
                )
                const finalReply = request.replies?.[request.replies.length - 1];

                return (
                    <details key={request._id}>
                        <summary>
                            {request.title} — {request.priority}
                        </summary>

                        <h3>Request information</h3>

                        {Object.entries(request.requestDetails).map(([name, value]) => {
                            const field = subcategory.formFields.find(
                                (field) => field.name === name
                            )

                            return (
                                <p key={name}>
                                    <strong>{field.label}:</strong> {value}
                                </p>
                                )})}
                        <h3>Technician Final Message</h3>

                        <p>{finalReply?.message || "No reply available"}</p>
                    </details>)
            })}

            {resolvedRequests.length === 0 && (
                <p>There are no resolved requests.</p>
            )}
        </div>
    );
}

export default ResolvedRequests;