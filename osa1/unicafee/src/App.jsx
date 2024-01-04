import { useState } from 'react'

const Header = (props) => {
  return  (
    <>
      <h1>  {props.header} </h1>
    </>
  )
}

const Button = (props) => {
  return  (
    <>
      <button onClick={ () => props.handleClick(props.text)}> 
        {props.text} 
      </button>
    </>
  )
}

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td> 
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad, all, avg, positive}) => {
  if (all === 0){
    return (
    <p>No feedback given</p>
    )
  } else {
    return(
      <table>
        <tbody>
          <StatisticsLine text="good" value={good} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="all" value={all} />
          <StatisticsLine text="average" value={avg} />
          <StatisticsLine text="positive" value={positive} />
        </tbody>
      </table>
      )
    }
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [avg, setAvg] = useState(0)
  const [positive, setPositive] = useState("0%")

  const handleClick = (type) => {

    const newGood = good + 1
    const newBad = bad + 1
    const newNeutral = neutral + 1

    setBad(type === "bad" ? newBad: bad)
    setGood(type === "good" ? newGood: good)
    setNeutral(type === "neutral" ? newNeutral: neutral)

    const newAll = all + 1
    setAll(newAll)
    const newAvg = ((1*(type === "good" ? newGood: good))+(-1*(type === "bad" ? newBad : bad)))/ newAll
    setAvg(newAvg)

    const newPositive = ((good/newAll)*100).toFixed(2) + "%"
    setPositive(newPositive)
  }


  return (
    <div>
      <Header header="give feedback" />
      <Button handleClick={handleClick} text="good" />
      <Button handleClick={handleClick} text="neutral" />
      <Button handleClick={handleClick} text="bad" />
      <Header header="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} avg={avg} positive={positive} />
    </div>
  )
}

export default App