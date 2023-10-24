export const NewTransactionHeader: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h2 css={({ color }) => ({ color: color.offWhite, marginTop: 4 })}>{children}</h2>
)
