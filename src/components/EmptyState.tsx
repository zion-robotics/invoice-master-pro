export function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center pt-16 md:pt-32 px-6">
      <svg viewBox="0 0 242 200" className="w-48 md:w-60" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <g fill="none" fillRule="evenodd">
          <path d="M232.092 109.638l-86.815-86.815a8.999 8.999 0 0 0-12.728 0l-12.728 12.729 67.882 67.882a8.999 8.999 0 0 1 0 12.728l-67.882 67.882 12.728 12.728a8.999 8.999 0 0 0 12.728 0l86.815-86.815a8.999 8.999 0 0 0 0-12.319z" fill="#9277FF"/>
          <path d="M158.302 122.367L84.78 195.89a8.999 8.999 0 0 1-12.728 0L9.93 133.766a8.999 8.999 0 0 1 0-12.728L83.453 47.515a8.999 8.999 0 0 1 12.728 0l62.121 62.122a8.999 8.999 0 0 1 0 12.73z" fill="#7C5DFA"/>
          <path d="M53.49 18.86c-19.08 7.111-32.671 25.493-32.671 47.05 0 22.171 14.382 41.018 34.337 47.682L53.49 18.86z" fill="#FFF"/>
          <circle fill="#7C5DFA" cx="68.323" cy="65.91" r="29.539"/>
        </g>
      </svg>
      <h2 className="mt-12 text-2xl font-bold text-foreground">There is nothing here</h2>
      <p className="mt-6 max-w-[220px] text-sm text-muted-foreground leading-[1.4]">
        Create an invoice by clicking the <strong>New Invoice</strong> button and get started
      </p>
    </div>
  );
}
