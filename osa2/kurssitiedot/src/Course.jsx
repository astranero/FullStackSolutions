const Header = ({name}) => {
    return (<>
      <h1> {name} </h1>
    </>)
  }
  
  const Part = ({name, exercises}) => {
    return (
      <p> {name} {exercises} </p>
    )
  }
  
  const Content = ({parts}) => {
  
    return (
      parts.map( (part) => <Part key={part.id} name={part.name} exercises={part.exercises}/> )
    )
  }
  
  
  const Course = ({course}) => {
  
    const sumParts = course.parts.reduce((initial, part) => {return initial+part.exercises}, 0);
  
    return (
    <>
      <Header name={course.name}/>
      <Content parts={course.parts}  />
      <b> total of {sumParts} exercises</b>
    </>
    )
  }

  export default Course;