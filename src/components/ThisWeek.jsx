import React from 'react';
import weekData from '../content/thisWeek.json';

export default function ThisWeek() {
  const { inStudio = [], inKiln = [], nextWorkshop = {} } = weekData || {};

  const hasContent = inStudio.length || inKiln.length || nextWorkshop?.title || nextWorkshop?.when;
  if (!hasContent) return null;

  return (
    <section className="this-week" aria-label="This week at the village">
      <div className="this-week__inner">
        <p className="label">This week</p>
        <div className="this-week__grid">
          <div>
            <h3>In the studio</h3>
            {inStudio.length ? (
              <ul>{inStudio.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
            ) : (
              <p>Quiet week — open studio hours remain available.</p>
            )}
          </div>
          <div>
            <h3>In the kiln</h3>
            {inKiln.length ? (
              <ul>{inKiln.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
            ) : (
              <p>No firings scheduled yet.</p>
            )}
          </div>
          <div>
            <h3>Next workshop</h3>
            {nextWorkshop?.title ? (
              <>
                <p className="this-week__title">{nextWorkshop.title}</p>
                <p>{nextWorkshop.when}</p>
              </>
            ) : (
              <p>Check back soon for the next session.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
