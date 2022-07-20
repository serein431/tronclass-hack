import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	entry: path.resolve(__dirname, 'main.js'),
	outDir: path.resolve(__dirname, 'dist'),
	devOutDir: path.resolve(__dirname, 'dev'),
	userscript: {
		name: '畅课 Hack',
		version: '1.0.4',
		include: /^http:\/\/courses.cuc.edu.cn\/course\/\d+\/learning-activity\/full-screen#\/\d+$/,
		url: 'https://github.com/WangNianyi2001/CUC-Life-Hack/raw/master/TronClass/dist/main.user.js',
		grants: ['unsafeWindow']
	},
};
