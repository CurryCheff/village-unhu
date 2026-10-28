import React from 'react';
import { teamMembers } from '../content/site';

export default function Team() {
  const people = teamMembers.filter((member) => !String(member.name).startsWith('[TODO'));
  if (!people.length) return null;

  return (
    <section className="team-block" aria-labelledby="team-title">
      <p className="label">People</p>
      <h3 id="team-title">The village team</h3>
      <div className="team-grid">
        {people.map((member) => (
          <article key={member.name} className="team-card">
            <div className="team-card__avatar" aria-hidden="true">{member.initials || member.name.slice(0, 2).toUpperCase()}</div>
            <div>
              <h4>{member.name}</h4>
              <p className="team-card__role">{member.role}</p>
              <p>{member.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
