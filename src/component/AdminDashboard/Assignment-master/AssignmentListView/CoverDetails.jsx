import QRCode from 'react-qr-code'

const CoverDetails = ({ coverDetails }) => {
    if (!coverDetails) {
        return (
            <div className="p-5 text-center">
                <h6 className="text-xl font-semibold">No cover details available.</h6>
            </div>
        );
    }

    return (
        <div className="mt-5 p-2.5 bg-white border border-black">
            <div>
                <nav className="bg-gray-100 flex flex-row border-b-8 border-blue-900 p-1 items-center">
                    <span className="pro-sidebar-logo ml-8 flex items-center">
                        <div>M</div>
                        <h5 className="text-black ml-2">
                            My Revision<sup className="text-blue-900">+</sup>
                        </h5>
                    </span>
                </nav>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2.5">
                <div>
                    <div className="flex justify-start">
                        <p className="text-center">
                            <strong>Name:</strong>
                            <input
                                className="border border-gray-300 w-96"
                                onChange={() => {
                                    // setCoverDetails({ ...coverDetails, students_id: e.target.value });
                                }}
                            />
                        </p>
                    </div>
                    <p><strong>Level:</strong> {coverDetails.level}</p>
                    <p><strong>Grade:</strong> {coverDetails.grade}</p>
                    <p><strong>Subject Name:</strong> {coverDetails.subject_name}</p>
                    <p><strong>Date:</strong> {new Date(coverDetails.date).toLocaleDateString()}</p>
                </div>
                <div className="mt-5">
                    <p><strong>Duration:</strong> {coverDetails.duration}</p>
                    <p><strong>Component:</strong> {coverDetails.component}</p>
                    <p><strong>Total Marks:</strong> {coverDetails.total_marks}</p>
                    <p><strong>Topic Name:</strong> {coverDetails.topic_name}</p>
                    <p><strong>Test Type:</strong> {coverDetails.test_type}</p>
                </div>
            </div>

            <h6 className="mt-5 text-center text-xl font-semibold">
                Cover Letter Instructions
            </h6>
            <p className="mt-2.5 text-left text-lg">
                • Write your name in the boxes above.<br />
                • Do not open this examination paper until instructed to do so.<br />
                • A graphic display calculator is required for this paper.<br />
                • Answer all questions.<br />
                • Unless otherwise stated in the questions, all numerical answers should be given exactly or correct to three significant figures.<br />
                • A clean copy of the mathematics: Application and Interpretation formula booklet is required for this paper.<br />
                • The Maximum marks for this examination paper is [110 marks].
            </p>

            <div className="flex justify-center items-center mt-5 mb-5">
                <QRCode value="https://www.ibglobalacademy.org/" size={160} />
            </div>
            <p className="mt-5 text-center text-lg">
                Please scan the above code and give the valuable Google review
            </p>

            <div className="flex justify-between mt-5 text-lg mb-2.5">
                <div>
                    <p className="text-center">Just Call or WhatsApp on:</p>
                    <p className="text-center">9971017569 | 9312411928</p>
                </div>
                <div>
                    <p className="text-center">For more info Visit:</p>
                    <p className="text-center">https://www.ibglobalacademy.org/</p>
                </div>
            </div>
        </div>
    )
}

export default CoverDetails