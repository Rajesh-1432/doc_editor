import Card from '@/components/Card';
import React from 'react'
import { GrDocumentCloud, GrDocumentUpdate } from "react-icons/gr";
const Home = () => {
    const handleClick1 = () => {
        console.log("Start New Document");
    }
    const handleClick2 = () => {
        console.log("Review masterpiece");
    }
    return (
        <div className='flex flex-col items-center justify-center h-full px-4 py-10 text-center gap-12'>
            <div className="flex flex-col items-center justify-center text-center sm:text-left sm:items-start gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-center">
                        <span className="text-[#EB1700]">Hey John</span>
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F8994915bf373498d9a0cc077e9cd0d45"
                            alt="User"
                            className="w-12 h-12 rounded-full inline-block mx-2 mb-2"
                        />
                        Ready to start something new or review the masterpiece you’ve got?
                    </h1>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
                <Card
                    title="Start New Document"
                    description="Begin a fresh specification using AI-powered guidance"
                    icon={GrDocumentCloud}
                    onClick={handleClick1}
                />
                <Card
                    title="Upload Existing Document"
                    description="Review, edit, or enhance a document you already have."
                    icon={GrDocumentUpdate}
                    onClick={handleClick2}
                />
            </div>
        </div>
    )
}

export default Home