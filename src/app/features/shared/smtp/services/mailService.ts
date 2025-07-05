import emailjs from '@emailjs/browser'

class MailService {
  private serviceId = 'service_pvh530a'
  private templates = {
    optId: 'template_t7usaxq',
  }

  constructor() {
    emailjs.init({
      publicKey: 'KXHkB6JP2hFANG0XB',
    })
  }

  async sendVerificationCode(email: string) {
    const code = this.generateRandomCode()
    console.log('Generated verification code:', code)

    const res = await emailjs.send(this.serviceId, this.templates.optId, { code, email })
    console.log(res.status, res.text)

    return code
  }

  private generateRandomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
}

export default new MailService()
