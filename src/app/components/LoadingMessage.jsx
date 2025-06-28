export default function LoadingMessage({ text = 'Loading...' }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] text-indigo-600 text-lg font-medium">
            {text}
        </div>
    );
}
