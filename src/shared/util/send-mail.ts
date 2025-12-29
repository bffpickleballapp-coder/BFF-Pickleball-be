import nodemailer from 'nodemailer';
export const sendMailAsync = async (
  to: string,
  subject: string,
  text: string,
): Promise<any> => {
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;
  if (!emailHost || !emailPort || !emailUser || !emailPass) {
    throw new Error('Email configuration is missing');
  }
  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === '465', // Use true for port 465, false for port 587
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: emailUser,
      to: to,
      subject: subject,
      html: '',
    });
    console.log(info);
    return info;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const templateEmail = (
  subject: string,
  text: string,
  link?: string,
): string => {
  const html = `<b>Hello world?</b>`;
  return html;
};
