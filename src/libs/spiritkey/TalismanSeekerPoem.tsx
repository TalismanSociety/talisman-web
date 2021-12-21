import styled from 'styled-components'

// TODO: Remove
export const TalismanSeekerPoem = styled(({ className }) => {
  return (
    <article className={className}>
      <h1>
        <li>Talisman Seeker, it's your spirit that's key.</li>
        <li>At the end of your seeking, you'll finally be free.</li>
        <li>A key to the new world is a difficult thing.</li>
        <li>You should ask yourself honestly, "what on earth should I bring?"</li>
        <li>Give a moment of thought as to whether it can be brought.</li>
        <li>All I can guarantee, is that nothing is for naught.</li>
      </h1>
    </article>
  )
})`
  width: 80%;
  color: var(--color-text);
  text-align: center;
  margin: 6rem auto 0 auto;

  h1 {
    font-family: 'ATApocRevelations', sans-serif;
    font-size: 4rem;
    font-weight: 400;
    list-style-type: none;
  }
`
