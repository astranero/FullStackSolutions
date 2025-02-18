const { PORT } = require('./utils/config')
const { app } = require('./app')

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
