import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Link } from 'react-router-dom'
import './Main.css'

import api from '../services/api'

import logo from '../assets/logo.svg'
import like from '../assets/like.svg'
import dislike from '../assets/dislike.svg'
import itsamatch from '../assets/itsamatch.png'

export default function Main ({ match }) {
  const [devs, setDevs] = useState([])
  const [matchDev, setMatchDev] = useState(null)

  useEffect(() => {
    async function loadDevs () {
      const response = await api.get('/devs', {
        headers: {
          user: match.params.id
        }
      })
      setDevs(response.data)
    }

    loadDevs()
  }, [match.params.id])

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: { dev: match.params.id }
    })
    socket.on('match', matchedDev => {
      setMatchDev(matchedDev)
    })
  }, [match.params.id])

  async function handleLike (id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers:{
        user: match.params.id
      }
    })

    setDevs(devs.filter(dev => dev._id !== id))
  }

  async function handleDislike (id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: {
        user: match.params.id
      }
    })

    setDevs(devs.filter(dev => dev._id !== id))
  }

  return (
    <div className='main-container'>
      <Link to='/'>
        <img src={logo} alt='Tindev'/>
      </Link>
      { devs.length > 0 ? (
        <ul>
          { devs.map(dev => (
            <li key={dev._id}>
              <img src={dev.avatar} alt=''/>
              <footer>
                <strong>{dev.name}</strong>
                <p>{dev.bio}</p>
              </footer>
              <div className='buttons'>
                <button type='button' onClick={() => handleDislike(dev._id)}>
                  <img src={dislike} alt='Dislike' />
                </button>
                <button type='button' onClick={() => handleLike(dev._id)}>
                  <img src={like} alt='Like' />
                </button>
              </div>
            </li>
          ))}
        </ul>) : (<div className='empty'>Acabou :( </div>)}

      { matchDev && (
        <div className='match-container' >
          <img src={itsamatch} alt="It's a Match" />
          <img className='avatar' src={matchDev.avatar} alt='avatar' />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>
          <button type='button' onClick={() => setMatchDev(null)}> Fechar </button>
        </div>
      )}
    </div>
  )
}
