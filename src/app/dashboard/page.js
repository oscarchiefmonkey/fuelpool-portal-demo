"use client";
import Layout from '../../components/Layout';
import AuthGuard from '../../components/AuthGuard';

export default function Dashboard() {
  return (
    <AuthGuard>
      <Layout>
        <div>
          <div className="mx-auto">
            <h1 className="text-gray-900 text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-700 text-base">
              Beskriv i boxar hur man skapar en cistern.
            </p>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}
