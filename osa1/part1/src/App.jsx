import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

const Header = (props) => {
  console.log(props)
  return (
  <>
    <h1> {props.course} </h1>
  </>
  )
}

const Part = (props) => {
  console.log(props)
  return (
  <>
    <p>
      {props.name} {props.exercises}
    </p>
  </>
  )
}

const Content = (props) => {
  console.log(props)
  const parts = props.parts
  return (
    <> 
      <Part name={parts[0].name} exercises={parts[0].exercises}/>
      <Part  name={parts[1].name} exercises={parts[1].exercises} />
      <Part  name={parts[2].name} exercises={parts[2].exercises} />
    </>
  )
}

const Total = (props) => {
  return (
    <>
     <p> Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises} </p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
    {
    name: 'Fundamentals of React',
    exercises: 10
    },
    {
    name: 'Using props to pass data',
    exercises: 7
    },
    { 
    name: 'State of a component',
    exercises: 14 
    }
  ] 
}

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </div>
  )
}

export default App
