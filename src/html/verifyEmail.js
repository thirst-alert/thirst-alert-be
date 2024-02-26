//TODO: MAKE A PRETTIER EMAIL AND SWITCH TO HTML TEMPLATE ENGINE
module.exports.generateVerifyEmail = (token) =>
	`
    <h1>Verify your email</h1>
    <p>This is your code to verify your account, input that in the Thirst Alert app.</p>
    <p>${token}</p>
  `