function AdminDocumentBlock({
  title,
  document,
  metaText,
  manage,
  onSend,
  onToggleApproval,
  onDelete,
  isSending,
  isUpdatingApproval,
  isDeleting,
}) {
  const hasUrl = Boolean(document?.url)
  const hasDoc = Boolean(document?.publicId)

  return (
    <div className="admin-inline-stack admin-doc-center-section">
      <strong className="admin-doc-center-title">{title}</strong>
      <div className="admin-action-group admin-doc-center-actions">
        {manage ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onSend}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        ) : null}

        {hasUrl ? (
          <>
            <a href={document.url} target="_blank" rel="noreferrer" className="btn btn-secondary">
              View
            </a>
            <a href={document.url} download className="btn btn-secondary">
              Download
            </a>
          </>
        ) : (
          <span className="admin-muted">Not available</span>
        )}

        {manage && hasDoc ? (
          <button
            type="button"
            className={document?.isApproved ? 'btn btn-danger' : 'btn btn-primary'}
            onClick={onToggleApproval}
            disabled={isUpdatingApproval}
          >
            {isUpdatingApproval
              ? 'Updating...'
              : document?.isApproved
                ? 'Revoke Approval'
                : 'Approve'}
          </button>
        ) : null}

        {manage && hasDoc ? (
          <button
            type="button"
            className="btn btn-danger"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        ) : null}
      </div>
      <small className="admin-meta">{metaText}</small>
    </div>
  )
}

export default function AdminDocumentCenter({
  item,
  manage = false,
  offerMetaText = '',
  certificateMetaText = '',
  onSendOffer,
  onSendCertificate,
  onToggleOfferApproval,
  onToggleCertificateApproval,
  onDeleteOffer,
  onDeleteCertificate,
  isSendingOffer = false,
  isSendingCertificate = false,
  isUpdatingOfferApproval = false,
  isUpdatingCertificateApproval = false,
  isDeletingOffer = false,
  isDeletingCertificate = false,
}) {
  return (
    <div className="admin-inline-stack admin-doc-center-grid">
      <AdminDocumentBlock
        title="Offer Letter"
        document={item?.offerLetter}
        metaText={offerMetaText}
        manage={manage}
        onSend={onSendOffer}
        onToggleApproval={onToggleOfferApproval}
        onDelete={onDeleteOffer}
        isSending={isSendingOffer}
        isUpdatingApproval={isUpdatingOfferApproval}
        isDeleting={isDeletingOffer}
      />

      <AdminDocumentBlock
        title="Certificate"
        document={item?.certificate}
        metaText={certificateMetaText}
        manage={manage}
        onSend={onSendCertificate}
        onToggleApproval={onToggleCertificateApproval}
        onDelete={onDeleteCertificate}
        isSending={isSendingCertificate}
        isUpdatingApproval={isUpdatingCertificateApproval}
        isDeleting={isDeletingCertificate}
      />
    </div>
  )
}
