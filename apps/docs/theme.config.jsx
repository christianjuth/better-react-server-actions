import { FaReact } from "react-icons/fa";
import { ImNpm } from "react-icons/im";

export default {
  logo: <>
    <FaReact style={{ color: '#61dafb', fontSize: '1.5rem' }} />
    <b style={{ marginLeft: '0.5ch' }}>Better React Server Actions</b>
  </>,
  docsRepositoryBase: 'https://github.com/christianjuth/better-react-server-actions/tree/main/apps/docs',
  project: {
    link: 'https://www.npmjs.com/package/better-react-server-actions',
    icon: (
      <div style={{ position: 'relative', height: '2rem' }}>
        <div style={{ position: 'absolute', inset: 5, background: 'white' }} />
        <ImNpm style={{ color: '#d60c0c', height: '2rem', width: '2rem', stroke: 'white', position: 'relative' }} />
      </div>
    )
  }
}
