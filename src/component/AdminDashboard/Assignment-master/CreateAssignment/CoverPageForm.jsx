import { useRef, Fragment } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import QRCode from 'react-qr-code';

const CoverPageForm = ({ 
  coverLetterDetails, 
  handleCoverLetterChange, 
  subjects,
  assignmentBoardId,
  assignmentPaperId, 
  assignmentSubjectId, 
  categories, 
  assignmentSourceId,
  assignmentSubjectLevelId
}) => {
  const qrCodeRef = useRef(null);
  
  console.log(assignmentSubjectId, "subjectid");

  return (
    <Fragment>
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        background: 'white', 
        border: '1px solid black' 
      }}>
        <div>
          <nav style={{
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'row',
            borderBottom: '10px solid #002b4f', 
            padding: '5px',
            alignItems: 'center',
          }}>
            <span className="pro-sidebar-logo" style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginLeft: '8px'
            }}>
              <div>M</div>
              <h5 style={{ 
                color: 'black', 
                marginLeft: '8px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                My Revision<sup style={{ color: '#002b4f' }}>+</sup>
              </h5>
            </span>
          </nav>
        </div>
        
        <hr style={{ 
          border: 'none',
          height: '1px',
          backgroundColor: '#ddd',
          margin: '10px 0'
        }} />
        
        <div style={{ marginTop: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* Student's Name */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Student's Name</label>
              <select
                value={coverLetterDetails.studentName}
                name="studentName"
                onChange={handleCoverLetterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              >
                <option value="Student A">Student A</option>
                <option value="Student B">Student B</option>
              </select>
            </div>
            
            {/* Level */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Level</label>
              <select
                value={coverLetterDetails.level || ""}
                name="level"
                onChange={handleCoverLetterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              >
                {assignmentBoardId && assignmentSubjectId &&
                  categories?.categories?.find(cat => cat._id === assignmentBoardId)
                    ?.subjects?.find(sub => sub._id === assignmentSubjectId)
                    ?.subjectlevels?.map(level => (
                      <option key={level.subject_level_name} value={level.subject_level_name}>
                        {level.subject_level_name}
                      </option>
                    ))
                }
              </select>
            </div>
            
            {/* Grade */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Grade</label>
              <select
                value={coverLetterDetails.grade}
                name="grade"
                onChange={handleCoverLetterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              >
                <option value="A">DP 1</option>
                <option value="B">DP 2</option>
              </select>
            </div>
            
            {/* Subject */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Subject</label>
              <select
                value={coverLetterDetails.subject}
                name="subject"
                onChange={handleCoverLetterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.subject_name}>
                    {subject.subject_name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Date</label>
            <DatePicker
  selected={coverLetterDetails.date ? new Date(coverLetterDetails.date) : new Date()}
  onChange={(date) => {
    handleCoverLetterChange({
      target: { name: "date", value: date.toISOString() }
    });
  }}
  dateFormat="yyyy-MM-dd"
  placeholderText="Select a date"
  className="date-picker-input"
  wrapperClassName="date-picker-wrapper"
  style={{
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px'
  }}
/>
            </div>
            
            {/* Duration */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Duration</label>
              <select
                value={coverLetterDetails.duration}
                name="duration"
                onChange={handleCoverLetterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              >
                <option value="1 Hour">1 Hour</option>
                <option value="2 Hours">2 Hours</option>
              </select>
            </div>
            
            {/* Component */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Component</label>
              <select
                value={coverLetterDetails.component}
                name="component"
                onChange={handleCoverLetterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              >
                {assignmentBoardId && assignmentSubjectId && assignmentSubjectLevelId && assignmentSourceId &&
                  categories?.categories
                    .find(cat => cat._id === assignmentBoardId)
                    ?.subjects.find(sub => sub._id === assignmentSubjectId)
                    ?.subjectlevels.find(level => level._id === assignmentSubjectLevelId)
                    ?.sources.find(source => source._id === assignmentSourceId)
                    ?.papers?.map(paper => (
                      <option key={paper.paper_name} value={paper.paper_name}>
                        {paper.paper_name}
                      </option>
                    ))
                }
              </select>
            </div>
            
            {/* Total Marks */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Total Marks</label>
              <select
                value={coverLetterDetails.totalMarks}
                name="totalMarks"
                onChange={handleCoverLetterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              >
                <option value="110">110</option>
                <option value="120">120</option>
              </select>
            </div>
            
            {/* Topic Name */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Topic Name</label>
              <select
                value={coverLetterDetails.topicName}
                name="topicName"
                onChange={handleCoverLetterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              >
                {assignmentBoardId && assignmentSubjectId && assignmentSubjectLevelId && assignmentSourceId && assignmentPaperId &&
                  categories?.categories
                    .find(cat => cat._id === assignmentBoardId)
                    ?.subjects.find(sub => sub._id === assignmentSubjectId)
                    ?.subjectlevels.find(level => level._id === assignmentSubjectLevelId)
                    ?.sources.find(source => source._id === assignmentSourceId)
                    ?.papers.find(paper => paper._id === assignmentPaperId)
                    ?.topics?.map(topic => (
                      <option key={topic.topic_name} value={topic.topic_name}>
                        {topic.topic_name}
                      </option>
                    ))
                }
              </select>
            </div>
            
            {/* Test Type */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500'
              }}>Test Type</label>
              <select
                value={coverLetterDetails.testType}
                name="testType"
                onChange={handleCoverLetterChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              >
                <option value="Topic Wise">Topic Wise</option>
                <option value="Midterm">Full length</option>
              </select>
            </div>
          </div>
        </div>
        
        <div id="coverLetterContent" style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>Selected Details:</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <p style={{ fontWeight: 'bold', margin: '5px 0' }}>Name: {coverLetterDetails.studentName}</p>
              <p style={{ fontWeight: 'bold', margin: '5px 0' }}>Level: {coverLetterDetails.level}</p>
              <p style={{ fontWeight: 'bold', margin: '5px 0' }}>Grade: {coverLetterDetails.grade}</p>
              <p style={{ fontWeight: 'bold', margin: '5px 0' }}>Subject: {coverLetterDetails.subjectName}</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', margin: '5px 0' }}>Date: {coverLetterDetails.date}</p>
              <p style={{ fontWeight: 'bold', margin: '5px 0' }}>Duration: {coverLetterDetails.duration}</p>
              <p style={{ fontWeight: 'bold', margin: '5px 0' }}>Component: {coverLetterDetails.component}</p>
              <p style={{ fontWeight: 'bold', margin: '5px 0' }}>Total Marks: {coverLetterDetails.totalMarks}</p>
              <p style={{ fontWeight: 'bold', margin: '5px 0' }}>Topic Name: {coverLetterDetails.topicName}</p>
              <p style={{ fontWeight: 'bold', margin: '5px 0' }}>Test Type: {coverLetterDetails.testType}</p>
            </div>
          </div>
        </div>

        <h4 style={{ fontSize: '18px', marginTop: '20px' }}>
          Cover Letter Instructions
        </h4>
        <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
          • Write your name in the boxes above.<br />
          • Do not open this examination paper until instructed to do so.<br />
          • A graphic display calculator is required for this paper.<br />
          • Answer all questions.<br />
          • Unless otherwise stated in the questions, all numerical answers should be given exactly or correct to three significant figures.<br />
          • A clean copy of the mathematics: Application and Interpretation formula booklet is required for this paper.<br />
          • The Maximum marks for this examination paper is [110 marks].
        </p>
        <p style={{ fontSize: '14px', marginTop: '20px' }}>
          Please scan the above code and give the valuable Google review
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          margin: '20px 0'
        }}>
          <QRCode value="https://www.ibglobalacademy.org/" size={128} ref={qrCodeRef} />
        </div>
        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Please scan the above code and give the valuable Google review
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '20px',
          fontSize: '14px'
        }}>
          <div>
            <p>Just Call or WhatsApp on:</p>
            <p>9971017569 | 9312411928</p>
          </div>
          <div>
            <p>For more info Visit:</p>
            <p>https://www.ibglobalacademy.org/</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CoverPageForm;