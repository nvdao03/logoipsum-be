import { createHash } from 'node:crypto'

function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

const hashpasword = (password: string) => {
  return sha256(password)
}

export default hashpasword
