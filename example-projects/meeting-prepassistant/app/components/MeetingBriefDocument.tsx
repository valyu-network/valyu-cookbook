import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { MeetingPrepResult } from '@/app/types/meeting-prep';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 45,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1f2937',
    lineHeight: 1.6,
  },
  header: {
    borderBottom: '3pt solid #de5833',
    paddingBottom: 18,
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  meta: {
    fontSize: 9.5,
    color: '#6b7280',
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    borderBottom: '2pt solid #de5833',
    paddingBottom: 6,
    letterSpacing: 0.3,
  },
  executiveSummary: {
    backgroundColor: '#f9fafb',
    padding: 18,
    borderLeft: '4pt solid #de5833',
    borderRadius: 3,
  },
  executiveSummaryText: {
    lineHeight: 1.7,
    color: '#374151',
    fontSize: 10.5,
  },
  listItem: {
    marginBottom: 8,
    padding: '10 14 10 10',
    backgroundColor: '#f9fafb',
    borderRadius: 3,
    borderLeft: '3pt solid #d1d5db',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    color: '#de5833',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 10,
    width: 12,
  },
  listItemText: {
    flex: 1,
    lineHeight: 1.6,
    fontSize: 10.5,
  },
  peopleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  personTag: {
    padding: '5 12',
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
    borderRadius: 16,
    fontSize: 9.5,
    fontWeight: 'bold',
    border: '1pt solid #d1d5db',
    marginRight: 6,
    marginBottom: 6,
  },
  sourceItem: {
    marginBottom: 12,
    padding: '10 14',
    backgroundColor: '#f9fafb',
    borderLeft: '3pt solid #9ca3af',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  sourceTitle: {
    color: '#de5833',
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  sourceDate: {
    fontSize: 8.5,
    color: '#6b7280',
    marginBottom: 5,
  },
  sourceSnippet: {
    fontSize: 9.5,
    color: '#4b5563',
    lineHeight: 1.5,
    marginBottom: 3,
  },
  sourceUrl: {
    fontSize: 8.5,
    color: '#9ca3af',
    lineHeight: 1.3,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '2pt solid #e5e7eb',
    textAlign: 'center',
    fontSize: 8.5,
    color: '#9ca3af',
  },
  footerText: {
    marginBottom: 3,
  },
});

interface MeetingBriefDocumentProps {
  result: MeetingPrepResult;
}

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MeetingBriefDocument = ({ result }: MeetingBriefDocumentProps) => {
  const { topic, generatedAt, brief, sources } = result;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{topic}</Text>
          <Text style={styles.meta}>Generated: {formatDate(generatedAt)}</Text>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.executiveSummary}>
            <Text style={styles.executiveSummaryText}>{brief.executiveSummary}</Text>
          </View>
        </View>

        {/* Key Developments */}
        {brief.keyDevelopments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Developments</Text>
            <View>
              {brief.keyDevelopments.map((dev, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listItemText}>{dev}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Key People */}
        {brief.keyPeople.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key People</Text>
            <View style={styles.peopleContainer}>
              {brief.keyPeople.map((person, idx) => (
                <Text key={idx} style={styles.personTag}>
                  {person}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Important Dates */}
        {brief.importantDates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Important Dates</Text>
            <View>
              {brief.importantDates.map((date, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listItemText}>{date}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Talking Points */}
        {brief.talkingPoints.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Talking Points</Text>
            <View>
              {brief.talkingPoints.map((point, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listItemText}>{point}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sources</Text>
            <View>
              {sources.slice(0, 8).map((source, idx) => (
                <View key={idx} style={styles.sourceItem}>
                  <Text style={styles.sourceTitle}>{source.title}</Text>
                  {source.publishedDate && (
                    <Text style={styles.sourceDate}>
                      {new Date(source.publishedDate).toLocaleDateString()}
                    </Text>
                  )}
                  {source.snippet && (
                    <Text style={styles.sourceSnippet}>{source.snippet}</Text>
                  )}
                  <Text style={styles.sourceUrl}>{source.url}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated with Intel Espresso • Powered by Valyu API
          </Text>
          <Text>https://platform.valyu.ai</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MeetingBriefDocument;
