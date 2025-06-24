import { NextResponse } from 'next/server';

const candidates = [
  {
    id: '1',
    createdAt: "1 day ago",
    name: 'Aarav Patel',
    batch: '2023',
    branch: 'CS',
    college: 'IIT',
    gpa: '3.8',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    github: 'https://github.com/aaravp',
    linkedin: 'https://linkedin.com/in/aaravp',
    email: 'aarav.patel@example.com',
    experienceYears: '0 Year',
    expectedSalary: '9 Lacs P.A.',
    location: 'Abdu Rahiman Nagar',
    description: 'A passionate developer with a strong grasp of frontend technologies.',
    education: 'B.Tech in Computer Science',
    image: '',
    isSaved: false,
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce application with React and Node.js',
        link: 'https://github.com/aaravp/ecommerce',
      },
    ],
    experience: [
      {
        role: 'Frontend Developer',
        company: 'Tech Solutions Inc.',
        duration: 'Summer 2022',
        description: 'Developed user interfaces with React and Redux',
      },
    ],
  },
  // ... [Add more static candidates 2 to 5 here, or continue your list]

  // Add 15 dynamic candidates below
  ...Array.from({ length: 15 }).map((_, index) => {
    const id = 6 + index;
    return {
      id: id.toString(),
      createdAt: `${id} days ago`,
      name: `Candidate ${id}`,
      batch: `202${id % 4}`,
      branch: ['CS', 'IT', 'ECE', 'EEE'][index % 4],
      college: ['IIT', 'NIT', 'BITS', 'IIIT'][index % 4],
      gpa: (3.5 + (index % 4) * 0.1).toFixed(1),
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Django'].slice(0, (index % 5) + 2),
      github: `https://github.com/candidate${id}`,
      linkedin: `https://linkedin.com/in/candidate${id}`,
      email: `candidate${id}@example.com`,
      experienceYears: `${index % 3} Years`,
      expectedSalary: `${6 + index % 5} Lacs P.A.`,
      location: ['Delhi', 'Mumbai', 'Hyderabad', 'Chennai', 'Bangalore'][index % 5],
      description: `Motivated graduate skilled in web development and software engineering.`,
      education: 'B.Tech in Computer Science',
      image: '',
      isSaved: false,
      projects: [
        {
          name: `Project ${id}`,
          description: `Worked on a project involving React and Node.js stack.`,
          link: `https://github.com/candidate${id}/project`,
        },
      ],
      experience: [
        {
          role: ['Intern', 'Junior Developer', 'Software Engineer'][index % 3],
          company: ['Tech Corp', 'Innovate Ltd', 'DevWorks'][index % 3],
          duration: `${index + 1} months`,
          description: 'Worked on real-time applications and improved performance.',
        },
      ],
    };
  }),
];

// Helper function to strip sensitive data for guest users
const getGuestCandidates = (list) =>
  list.map(({ email,expectedSalary,description,gpa,image,location,college,isSaved, github, linkedin, projects, experience, ...rest }) => ({
    ...rest,
    secureNotice: 'Some information is only visible to logged-in users.',
  }));

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  const isAuthenticated = !!token; // Replace with proper token validation in production

  const dataToReturn = isAuthenticated
    ? candidates
    : getGuestCandidates(candidates.slice(0, 5)); // ⛔️ Limit to 5 candidates for guests

  return NextResponse.json(dataToReturn);
}
