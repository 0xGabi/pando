import '@babel/polyfill'

import Aragon from '@aragon/client'
import IPFS from 'ipfs-http-client'

import IOrganism from '../build/contracts/IOrganism.json'

const app = new Aragon()
const ipfs = IPFS({ host: 'localhost', port: '5001', protocol: 'http' })

app.store(async (state, event) => {
  if (!state) {
    state = { rfiVotes: [], rflVotes: [], organisms: {}, cache: {} }
  }

  console.log('event', event)

  switch (event.event) {
    case 'NewRFIVote':
      // if (!state.organisms[event.returnValues.organism]) {
      //   state.organisms[event.returnValues.organism] = true

      //   const organism = app.external(
      //     event.returnValues.organism,
      //     IOrganism.abi
      //   )
      //   organism.events().subscribe(test => {
      //     console.log('organism', test)
      //   })
      // }

      const rfiCondition = state.rfiVotes.filter(
        ({ organism, RFIid }) =>
          organism === event.returnValues.organism &&
          RFIid === event.returnValues.id
      ).length

      if (!state.rfiVotes.length || !rfiCondition) {
        let rfiPayload = await getRFIVotes(
          event.returnValues.organism,
          event.returnValues.id
        )
        rfiPayload.organism = event.returnValues.organism
        rfiPayload.metadata = await getRFIMetadata(
          event.returnValues.organism,
          event.returnValues.id
        )
        state.rfiVotes.push(rfiPayload)
      }

      return state
    case 'NewRFLVote':
      const rflCondition = state.rflVotes.filter(
        ({ organism, RFLid }) =>
          organism === event.returnValues.organism &&
          RFLid === event.returnValues.id
      ).length

      if (!state.rflVotes.length || !rflCondition) {
        let rflPayload = await getRFLVotes(
          event.returnValues.organism,
          event.returnValues.id
        )
        rflPayload.organism = event.returnValues.organism
        rflPayload.metadata = await getRFL(
          event.returnValues.organism,
          event.returnValues.id
        )
        state.rflVotes.push(rflPayload)
      }

      return state
    case 'CastRFIVote':
      if (!state.cache[event.id]) {
        state.cache[event.id] = true

        state.rfiVotes.map(vote => {
          if (
            vote.organism === event.returnValues.organism &&
            vote.RFIid === event.returnValues.id
          ) {
            if (!vote.participants) {
              vote.participants = [
                {
                  address: event.returnValues.voter,
                  supports: event.returnValues.supports,
                },
              ]
              return vote
            }
            if (
              vote.participants.filter(
                person => person.address === event.returnValues.voter
              ).length
            ) {
              vote.participants = vote.participants.map(person => {
                if (person.address === event.returnValues.voter) {
                  person.supports = event.returnValues.supports
                  return person
                }
              })
            } else {
              vote.participants.push({
                address: event.returnValues.voter,
                supports: event.returnValues.supports,
              })
            }

            vote.participation = vote.participants.length
            vote.yea = vote.participants.filter(
              person => person.supports
            ).length
            vote.nay = vote.participants.filter(
              person => !person.supports
            ).length

            return vote
          }
        })
      }

      return state
    case 'CastRFLVote':
      if (!state.cache[event.id]) {
        state.cache[event.id] = true

        state.rflVotes.map(vote => {
          if (
            vote.organism === event.returnValues.organism &&
            vote.RFLid === event.returnValues.id
          ) {
            if (!vote.participants) {
              vote.participants = [
                {
                  address: event.returnValues.voter,
                  supports: event.returnValues.supports,
                  stake: event.returnValues.stake,
                },
              ]
              return vote
            }
            if (
              vote.participants.filter(
                person => person.address === event.returnValues.voter
              ).length
            ) {
              vote.participants = vote.participants.map(person => {
                if (person.address === event.returnValues.voter) {
                  person.supports = event.returnValues.supports
                  person.stake = event.returnValues.stake
                  return person
                }
              })
            } else {
              vote.participants.push({
                address: event.returnValues.voter,
                supports: event.returnValues.supports,
                stake: event.returnValues.stake,
              })
            }

            // vote.participation = vote.participants.length
            // vote.yea = vote.participants.filter(
            //   person => person.supports
            // ).length
            // vote.nay = vote.participants.filter(
            //   person => !person.supports
            // ).length

            vote.total = vote.participants.reduce(
              (acc, person) => acc + person.stake
            )

            return vote
          }
        })
      }

      return state
    case 'ExecuteRFIVote':
      if (!state.cache[event.id]) {
        state.cache[event.id] = true

        state.rfiVotes.map(vote => {
          if (
            vote.organism === event.returnValues.organism &&
            vote.RFIid === event.returnValues.id
          ) {
            vote.state = '1'
          }
          return vote
        })
      }

      return state
    case 'CancelRFIVote':
      if (!state.cache[event.id]) {
        state.cache[event.id] = true

        state.rfiVotes.map(vote => {
          if (
            vote.organism === event.returnValues.organism &&
            vote.RFIid === event.returnValues.id
          ) {
            vote.state = '2'
          }
          return vote
        })
      }

      return state
    case 'ExecuteRFLVote':
      if (!state.cache[event.id]) {
        state.cache[event.id] = true

        state.rflVotes.map(vote => {
          if (
            vote.organism === event.returnValues.organism &&
            vote.RFLid === event.returnValues.id
          ) {
            vote.state = '1'
          }
          return vote
        })
      }

      return state
    case 'CancelRFLVote':
      if (!state.cache[event.id]) {
        state.cache[event.id] = true

        state.rflVotes.map(vote => {
          if (
            vote.organism === event.returnValues.organism &&
            vote.RFLid === event.returnValues.id
          ) {
            vote.state = '2'
          }
          return vote
        })

        return state
      }

    case 'MergeRFI':
      if (!state.cache[event.id]) {
        state.cache[event.id] = true

        state.rfiVotes.map(vote => {
          if (
            vote.organism === event.returnValues.organism &&
            vote.RFIid === event.returnValues.id
          ) {
            vote.status = 1
          }
        })
      }

      return state
    case 'RejectRFI':
      if (!state.cache[event.id]) {
        state.cache[event.id] = true

        state.rfiVotes.map(vote => {
          if (
            vote.organism === event.returnValues.organism &&
            vote.RFIid === event.returnValues.id
          ) {
            vote.status = 0
          }
        })
      }

      return state

    case 'AcceptRFL':
      if (!state.cache[event.id]) {
        state.cache[event.id] = true

        state.rflVotes.map(vote => {
          if (
            vote.organism === event.returnValues.organism &&
            vote.RFLid === event.returnValues.id
          ) {
            vote.status = 1
          }
        })
      }

      return state

    case 'RejectRFL':
      if (!state.cache[event.id]) {
        state.cache[event.id] = true

        state.rflVotes.map(vote => {
          if (
            vote.organism === event.returnValues.organism &&
            vote.RFLid === event.returnValues.id
          ) {
            vote.status = 0
          }
        })
      }

      return state

    default:
      return state
  }
})

function getRFIVotes(organism, id) {
  return new Promise(resolve => {
    app.call('RFIVotes', organism, id).subscribe(resolve)
  })
}

function getRFLVotes(organism, id) {
  return new Promise(resolve => {
    app.call('RFLVotes', organism, id).subscribe(resolve)
  })
}

function getRFIMetadata(organism, id) {
  return new Promise(resolve => {
    app.call('getRFIMetadata', organism, id).subscribe(async hash => {
      const metadata = (await ipfs.dag.get(hash)).value
      resolve({ message: metadata.message, tree: metadata.tree })
    })
  })
}

function getRFL(address, id) {
  return new Promise((resolve, reject) => {
    const organism = app.external(address, IOrganism.abi)

    organism.getRFLLineage(id).subscribe(lineage => {
      resolve({
        destination: lineage.destination,
        minimum: lineage.minimum,
        metadata: lineage.metadata,
      })
    })
  })
}
