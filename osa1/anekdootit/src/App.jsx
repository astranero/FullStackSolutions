import { useState } from 'react'

const Button = (props) => {
  return (
  <>
    <button onClick={ props.HandleClick }>
     { props.text }
    </button>
  </>
  )
}

const AnecdoteLine = ({vote, anecdote}) => {
  return (
    <>
      <p>{anecdote}</p>
      <p> has {vote} votes</p>
    </>
  )
}

const Header = ({text}) => {
  return (
    <h1>
      {text}
    </h1>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const randomvalue = (min, max) => {
    return Math.floor(Math.random() * (max-min) + min);
  };

  const HandleClick = (props) => {
    const min = 0;
    const max = anecdotes.length;
    const randomInt = randomvalue(min, max);
    setSelected(randomInt);
  }

  const HandleVote = () => {
    const newVotes = [... votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  const getMaxIndex = () =>  {
    const maxVote = Math.max(...votes)
    const maxVoteIndexes = []
    for (let i = 0; i < anecdotes.length; i++){
      if (votes[i] == maxVote){
        maxVoteIndexes.push(i)
      }
    }

    const min = 0
    const max = maxVoteIndexes.length
    const randInt =  randomvalue(min, max)
    return maxVoteIndexes[randInt]
  }

  const maxValIndex = getMaxIndex()

  return (
    <div>
      <Header text="Anecdote of the day" />
      <AnecdoteLine anecdote={anecdotes[selected]} vote={votes[selected]}/>
      <Button HandleClick={HandleVote} text="votes" />
      <Button HandleClick={HandleClick} text="next anecdote" />
      <Header text="Anecdote with most votes" />
      <AnecdoteLine anecdote={anecdotes[maxValIndex]} vote={votes[maxValIndex]} />
    </div>
  )
}

export default App