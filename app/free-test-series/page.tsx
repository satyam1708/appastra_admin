// app/free-test-series/page.tsx
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchTestSeries } from "@/src/features/tests/testThunks";
import { TestSeries } from "@/src/types";
import Link from "next/link";


const TestSeriesCard = ({ series }: { series: TestSeries }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{series.title}</h3>
        <p className="text-gray-600 mb-4">{series.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-green-600">Free</span>
          <Link href={`/test-series/${series.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              View Tests
          </Link>
        </div>
      </div>
    </div>
  );

export default function FreeTestSeriesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { testSeries, loading, error } = useSelector((state: RootState) => state.tests);
  
    useEffect(() => {
      dispatch(fetchTestSeries());
    }, [dispatch]);
  
    const freeTestSeries = testSeries.filter(series => series.isFree);

    if (loading) return <p>Loading free test series...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Free Test Series</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freeTestSeries.map((series) => (
            <TestSeriesCard key={series.id} series={series} />
          ))}
        </div>
      </div>
    );
}