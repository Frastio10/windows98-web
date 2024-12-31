import styled from "styled-components";

const AboutMe = () => {
  return (
    <Content>
      <Title>Hi, I am Frastio</Title> {/* New Title Added */}
      <Section>
        <Heading>About Me</Heading>
        <Description>
          a Softtware Engineer who loves programming, especially frontend
          development. While I focus on frontend work, I’m also interested in
          things like game development and backend programming. I enjoy taking
          on different projects, trying out new ideas, and experimenting in my
          free time. Building something useful and unique is what keeps me
          excited about coding. Just like the site you are in right now :)
        </Description>
      </Section>
      <Section>
        <Heading>Works</Heading>

        <List>
          <Item>
            <b>Fullstack Developer (Remote)</b> -{" "}
            <Company>
              <a href="https://frast.dev" target="_blank">
                Freelance
              </a>
            </Company>
            <Details>Feb, 2021 - Now</Details>
            <Description>
              <StyledList>
                <ListItem>
                  Designed the whole system for the project such as the
                  database, workflow, CI/CD from scratch.
                </ListItem>
                <ListItem>
                  Developed the Back End and Front End using NextJS and NodeJS
                  with Adonis JS framework.
                </ListItem>
                <ListItem>
                  Collaborated with designers and QA to create beautiful Web
                  App.
                </ListItem>
                <ListItem>
                  Created various websites for many clients from Crypto sites to
                  SAAS.
                </ListItem>
              </StyledList>
            </Description>
          </Item>
          <Item>
            <b>Frontend Developer (Jakarta, Remote)</b> -{" "}
            <Company>
              <a href="https://suitmedia.com" target="_blank">
                Suitmedia
              </a>
            </Company>
            <Details>Feb, 2022 - Nov, 2024</Details>
            <Description>
              <StyledList>
                <ListItem>
                  Maintained and debugged large-scale websites for major
                  companies, ensuring optimal performance and reliability.
                </ListItem>
                <ListItem>
                  Supervised and mentored interns, providing guidance on
                  projects and conducting thorough code reviews to uphold
                  quality standards.
                </ListItem>
                <ListItem>
                  Designed and developed a scalable base code template for
                  Next.js, streamlining future projects and improving
                  development efficiency.
                </ListItem>
                <ListItem>
                  Collaborated closely with cross-functional teams, fostering
                  effective communication and alignment between divisions.
                </ListItem>
                <ListItem>
                  Created visually appealing and high-performance UI components
                  integrated seamlessly with robust APIs.
                </ListItem>
                <ListItem>
                  Wrote clean, modular, and maintainable code, prioritizing
                  readability and long-term scalability.
                </ListItem>
              </StyledList>
            </Description>
          </Item>
          <Item>
            <b>Frontend Developer Intern (Jakarta, Remote)</b> -{" "}
            <Company>
              <a href="https://google.com" target="_blank">
                Aseries Informix Solution Technology (AIST)
              </a>
            </Company>
            <Details>Feb, 2022 - Nov, 2024</Details>
            <Description>
              <StyledList>
                <ListItem>
                  Gained valuable insights into the inner workings of the tech
                  industry, including real-world development workflows and
                  collaboration.
                </ListItem>
                <ListItem>
                  Transformed design concepts into fully functional, responsive
                  websites, bridging the gap between design and implementation.
                </ListItem>
                <ListItem>
                  Developed and optimized landing pages for startup companies,
                  focusing on user experience, performance, and modern web
                  standards.
                </ListItem>
              </StyledList>
            </Description>
          </Item>
        </List>
      </Section>
      <Divider />
      <Section>
        <Heading>Education</Heading>
        <List>
          <Item>
            <b>Bachelor's Degree</b> in Computer Science
            <br />
            <Details>Mercu Buana | 2023 - 2027</Details>
          </Item>
          <Item>
            <b>High School Diploma</b>
            <br />
            <Details>Cibadak Vocational Highschool | 2021</Details>
          </Item>
        </List>
      </Section>
      <Divider />
      <Section>
        <Heading>Skills</Heading>
        <SkillsGrid>
          <Skill>HTML & CSS</Skill>
          <Skill>TypeScript</Skill>
          <Skill>React</Skill>
          <Skill>Vue</Skill>
          <Skill>Tailwind CSS</Skill>
          <Skill>Node.js</Skill>
          <Skill>Postgres</Skill>
          <Skill>Docker</Skill>
          <Skill>Mentoring & Supervising</Skill>
        </SkillsGrid>
      </Section>
    </Content>
  );
};

export default AboutMe;

const Content = styled.div`
  overflow: auto;
  height: 100%;
  padding: 16px;
  background-color: #e4e4e4; /* Classic Win98 background */
  color: #000;
  font-size: 14px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #000080; /* Classic Win98 blue */
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 2px 2px #fff;
  text-decoration: underline;
  text-underline-offset: 5px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Heading = styled.h2`
  font-size: 16px;
  color: #000080; /* Classic Win98 blue */
  margin-bottom: 8px;
  text-shadow: 1px 1px #fff;
  border-bottom: 1px solid #808080; /* Gray divider */
  padding-bottom: 4px;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  margin-bottom: 16px;
  line-height: 1.4;
`;

const Details = styled.div`
  font-size: 12px;
  color: #555;
`;

const Description = styled.p`
  font-size: 12px;
  color: #333;
  line-height: 1.3;
  margin: 6px 0;
`;

const Company = styled.span`
  color: #008000; /* Green for company names */
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #000;
  margin: 20px 0;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`;

const Skill = styled.div`
  background: #c3c7cb; /* Light gray Win98 button color */
  // border: 2px solid #000;
  color: #000;
  text-align: center;
  padding: 6px;
  box-shadow:
    inset -1px -1px 0 #fff,
    inset 1px 1px 0 #000;
  font-size: 12px;
  text-transform: capitalize;
  cursor: pointer;

  &:hover {
    background: #000080;
    color: #fff;
  }
`;

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px; /* Slightly increased gap for better readability */
  padding-left: 0; /* Remove default padding for list */
  margin: 0; /* Remove default margin */
  list-style-type: none; /* Remove default bullet */
`;

const ListItem = styled.li`
  font-size: 12px;
  color: #333;
  position: relative;
  padding-left: 16px; /* Space for custom dot */

  &::before {
    content: "•"; /* Custom dot character */
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px; /* Size of the dot */
    color: #000080; /* Dot color (same as the heading color) */
  }
`;
