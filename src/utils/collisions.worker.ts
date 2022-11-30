self.onmessage = ({ data: { command } }) => {
  self.postMessage('SYNCINGIN')
};