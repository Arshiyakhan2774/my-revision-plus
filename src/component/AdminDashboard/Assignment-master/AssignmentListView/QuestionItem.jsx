const QuestionItem = ({ question = {}, index, mediaBaseURL, level = 0 }) => {
    return (
      <Paper elevation={2} style={{ padding: "15px", marginBottom: "10px" }}>
        <Typography component="span" style={{ fontWeight: "bold" }}>
          ({index + 1})
        </Typography>
        <Typography variant="body1" component="span" style={{ marginLeft: "18px" }}>
          Maximum Marks: <strong>[{question.marks || "N/A"}]</strong>
        </Typography>
  
        <Typography component="div" style={{ marginLeft: "3%", marginTop: "4px" }}>
          {question.question_title ? (
            <div dangerouslySetInnerHTML={{ __html: question.question_title }} />
          ) : (
            "No question available"
          )}
        </Typography>
  
     
        <RenderMedia mediaArray={question.images || []} type="image" baseURL={mediaBaseURL} />
        <RenderMedia mediaArray={question.videos || []} type="video" baseURL={mediaBaseURL} />
        <RenderMedia mediaArray={question.docs || []} type="pdf" baseURL={mediaBaseURL} />
  
        {(question.subquestions || []).map((subQ, subIndex) => (
          <QuestionItem
            key={subQ._id || subIndex}
            question={subQ}
            index={subIndex}
            mediaBaseURL={mediaBaseURL}
            level={level + 1}
          />
        ))}
  
        {(question.subchildquestions || []).map((subChildQ, subChildIndex) => (
          <QuestionItem
            key={subChildQ._id || subChildIndex}
            question={subChildQ}
            index={subChildIndex}
            mediaBaseURL={mediaBaseURL}
            level={level + 2}
          />
        ))}
      </Paper>
    );
  };
  