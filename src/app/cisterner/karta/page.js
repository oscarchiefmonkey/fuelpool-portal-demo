import Layout from '../../../components/Layout';
import AuthGuard from '../../../components/AuthGuard';

export default function Karta() {
  return (
    <AuthGuard>
      <Layout>
      <div className="">
        <div className="mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Karta</h1>
            <p className="mt-2 text-gray-600">this is cisterner</p>
          </div>
        </div>
      </div>
      </Layout>
    </AuthGuard>
  );
}

