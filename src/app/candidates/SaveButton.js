
import { useState } from "react";
import { showToast } from "../utils/toastUtils";
const SaveButton = ({ candidateId, recruiterId, defaultSaved = false, onToggle }) => {
    const [isSaved, setIsSaved] = useState(defaultSaved);

    const handleToggle = async () => {
        console.log("recruiterId",recruiterId);
        const method = isSaved ? 'DELETE' : 'POST';

        const res = await fetch('/api/savecandidate', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ candidate_id: candidateId, recruiter_id: recruiterId }),
        });

        if (res.ok) {
            const newState = !isSaved;
            setIsSaved(newState);
            showToast('Saved successful!', 'success');
            if (onToggle) onToggle(candidateId, newState);
        }
    };

    return (
        <button onClick={handleToggle} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">
            {isSaved ? 'Saved' : 'Save'}
        </button>
    );
};
export default SaveButton;