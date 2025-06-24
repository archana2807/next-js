export default function LoadingSpinner({ text = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid mb-3"></div>
            <p className="text-gray-600 text-sm">{text}</p>
        </div>
    );
}
