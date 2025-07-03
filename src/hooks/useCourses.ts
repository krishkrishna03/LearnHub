import { useState, useEffect } from 'react';
import axios from 'axios';

interface Course {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructor: {
    firstName: string;
    lastName: string;
  };
  category: string;
  level: string;
  price: number;
  thumbnail: string;
  duration: string;
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  enrolledStudents: string[];
}

interface CoursesResponse {
  success: boolean;
  courses: Course[];
  pagination?: {
    page: number;
    pages: number;
    total: number;
  };
}

export const useCourses = (filters?: {
  category?: string;
  level?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        
        if (filters?.category) params.append('category', filters.category);
        if (filters?.level) params.append('level', filters.level);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        console.log('Fetching courses with params:', params.toString());
        
        const response = await axios.get<CoursesResponse>(`/courses?${params}`);
        
        if (response.data.success) {
          setCourses(response.data.courses);
          setPagination(response.data.pagination);
        } else {
          throw new Error('Failed to fetch courses');
        }
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch courses';
        setError(errorMessage);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters?.category, filters?.level, filters?.search, filters?.page, filters?.limit]);

  return { courses, loading, error, pagination };
};

export const useFeaturedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching featured courses...');
        const response = await axios.get<CoursesResponse>('/courses/featured');
        
        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          throw new Error('Failed to fetch featured courses');
        }
      } catch (err: any) {
        console.error('Error fetching featured courses:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch featured courses';
        setError(errorMessage);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return { courses, loading, error };
};

export const useCourse = (id: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching course:', id);
        const response = await axios.get(`/courses/${id}`);
        
        if (response.data.success) {
          setCourse(response.data.course);
        } else {
          throw new Error('Failed to fetch course');
        }
      } catch (err: any) {
        console.error('Error fetching course:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch course';
        setError(errorMessage);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  return { course, loading, error };
};