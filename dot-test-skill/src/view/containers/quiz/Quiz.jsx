import React, { useEffect, useState, Suspense } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import axios from "axios";
import Swal from 'sweetalert2';
import LazyCardComponent from '../../components/CardComponent';
import Table from 'react-bootstrap/Table';

function Quiz() {
  const [data, setData] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [time, setTime] = useState(5); // Waktu awal per pertanyaan
  const [totalTime, setTotalTime] = useState(15); // Waktu total untuk semua soal
  const [finished, setFinished] = useState(false);
  const [allAnswer, setAllAnswer] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [curAnswer, setCurAnswer] = useState("");
  const [resumes, setResumes] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=3&type=boolean');
        setData(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let timer;
    if (quizStarted && !finished) {
      timer = setTimeout(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 5)); // Mengurangi waktu per pertanyaan
        setTotalTime((prevTotalTime) => (prevTotalTime > 0 ? prevTotalTime - 1 : 15)); // Mengurangi waktu total
        if (time === 0) {
          setCurAnswer("");
          setQuestionIndex((prevIndex) => (prevIndex < 2 ? prevIndex + 1 : 0));
        }
      }, 1000);
    }

    // Reset timer and move to the next question when time is up
    if (time === 0 && !finished) {
      handleInput();
    }

    return () => clearTimeout(timer);
  }, [time, questionIndex, finished, quizStarted]);

  useEffect(() => {
    const savedResumes = localStorage.getItem('quizResumes');
    if (savedResumes) {
      setResumes(JSON.parse(savedResumes));
    }
  }, []);

  useEffect(() => {
    if (finished) {
      const currentDate = new Date();
      const newResume = {
        totalQuestions: data.length,
        questionsAnswered: allAnswer.filter(data => data !== "").length, // jumlah soal yang telah dijawab
        correctAnswers,
        incorrectAnswers: data.length - correctAnswers,
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString(),
        day: getDayOfWeek(currentDate.getDay())
      };

      const updatedResumes = [...resumes, newResume];
      localStorage.setItem('quizResumes', JSON.stringify(updatedResumes));
      setResumes(updatedResumes);
    }
  }, [finished, correctAnswers, allAnswer, data]);

  const handleQuestion = (e) => {
    setCurAnswer(e.target.value);
  };

  const handleInput = () => {
    if (curAnswer === data[questionIndex]?.correct_answer) {
      setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
    }
    
    setAllAnswer([...allAnswer, curAnswer]);
    setCurAnswer("");
    setTime(5); // Kembalikan waktu per pertanyaan menjadi 5 detik
    setQuestionIndex((prevIndex) => prevIndex + 1);

    if (questionIndex === 2) {
      setFinished(true);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleFinish = () => {
    if (curAnswer === data[questionIndex]?.correct_answer) {
      setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
    }
    if (finished) {
      console.log(allAnswer);
    } else {
      setAllAnswer([...allAnswer, curAnswer]);
      setCurAnswer("");
    }
  
    // Mendapatkan hasil resume
    const resumeMessage = getResumeMessage();
  
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your work has been saved",
      text: resumeMessage, // Menggunakan hasil resume sebagai pesan teks
      showConfirmButton: false,
      timer: 10000
    });
  
    if (questionIndex === 2) {
      setFinished(true);
    } else {
      handleInput();
    }
  };
  
  // Fungsi untuk mendapatkan hasil resume sebagai string
  const getResumeMessage = () => {
    const totalQuestions = data.length;
    const questionsAnswered = allAnswer.filter(data => data !== "").length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();
    const day = getDayOfWeek(currentDate.getDay());
  
    return `Total Questions: ${totalQuestions}\nQuestions Answered: ${questionsAnswered}\nCorrect Answers: ${correctAnswers}\nIncorrect Answers: ${incorrectAnswers}`;
  };

  function getDayOfWeek(dayNumber) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  }

   // Fungsi untuk mendekode teks HTML menjadi format teks yang dapat dibaca
   const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };
  return (
    <Container className="my-5">
      <Row>
        <Col xs={7}>
          <Card className='p-3'>
            <Card.Title>Quiz magang dot</Card.Title>
            <hr />
            {quizStarted ? (
              <>
                 <Card.Subtitle>
                  {!finished && decodeHTML(data[questionIndex]?.question)}
                  {/* Mendekode teks pertanyaan sebelum ditampilkan */}
                </Card.Subtitle>
                {!finished ? 
                <Card.Body>
                  <Card body className="my-3">
                    <Form.Check
                      onChange={handleQuestion}
                      checked={curAnswer === "False"}
                      type="radio"
                      label={`False`}
                      value={"False"}
                      name="formHorizontalRadios"
                      id={`formHorizontalRadiosFalse`}
                    />
                  </Card>
                  <Card body className="my-3">
                    <Form.Check
                      onChange={handleQuestion}
                      checked={curAnswer === "True"}
                      type="radio"
                      label={`True`}
                      value={"True"}
                      name="formHorizontalRadios"
                      id={`formHorizontalRadiosTrue`}
                    />
                  </Card>
                  <Row>
                    <Col>
                      {quizStarted && questionIndex < 2 && !finished &&
                        <Button variant="success" onClick={handleInput}>
                          Next
                        </Button>
                      }
                      {quizStarted && questionIndex === 2 &&
                        <Button variant="success" onClick={handleFinish}>
                          Finish
                        </Button>
                      }
                    </Col>
                  </Row>
                </Card.Body> : <h1>Finished</h1>}
              </>
            ) : (
              <div className="text-center">
                <Button variant="primary" onClick={handleStartQuiz}>Start Quiz</Button>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={5}>
          <Suspense fallback={<div>Loading...</div>}>
            <Row>
              <Col>
            <LazyCardComponent header="Total Time" title="Total Time Remaining" content={finished ? "Finished" : `00:${totalTime}`} />
              </Col>
              <Col>
            <LazyCardComponent header="Total Questions" title="Total Questions" content={data.length} />
              </Col>
            </Row>
              <br />
            <LazyCardComponent header="Questions Answered" title="Questions Answered" content={allAnswer.filter(data => data !== "").length} />
              
          </Suspense>
          <Row className='mt-5'>
            <Col xs={12} className='mb-3'>
              <h3 className='text-center'>Resume Quiz</h3>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Day</th>
                    <th>Total Questions</th>
                    <th>Questions Answered</th>
                    <th>Correct Answers</th>
                    <th>Incorrect Answers</th>
                  </tr>
                </thead>
                <tbody>
                  {resumes && resumes.map((resume, index) => (
                    <tr key={index}>
                      <td>{resume.date}</td>
                      <td>{resume.time}</td>
                      <td>{resume.day}</td>
                      <td>{resume.totalQuestions}</td>
                      <td>{resume.questionsAnswered}</td>
                      <td>{resume.correctAnswers}</td>
                      <td>{resume.incorrectAnswers}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Quiz;
