const getHashNow = () => {
    const randomHash = Math.random().toString(36).substr(2, 6)
    const date = new Date().toISOString()
    console.log(date , randomHash)
  
    setTimeout(getHashNow, 5000)
  }
  
  getHashNow()